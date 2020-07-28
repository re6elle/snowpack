import execa from 'execa';
import npmRunPath from 'npm-run-path';
import {promises as fs} from 'fs';
const cwd = process.cwd();

// TODO: import this from snowpack
interface SnowpackConfig {
  name: string;
  resolve: {
    input: string[];
    output: string[];
  };
  load(options: {
    filePath: string;
    log: (msg: string, data: any) => void;
  }): Promise<Record<string, string> | string | null | undefined>;
}

type SnowpackPluginFactory<PluginOptions> = (config: any, options: PluginOptions) => SnowpackConfig;

export interface BuildScriptPluginOptions {
  input: string[];
  output: string[];
  cmd: string;
}

const buildScriptPlugin: SnowpackPluginFactory<BuildScriptPluginOptions> = (
  _,
  {input, output, cmd},
) => {
  if (output.length !== 1) {
    throw new Error('Requires one output.');
  }
  return {
    name: `build:${cmd.split(' ')[0]}`,
    resolve: {
      input: input,
      output: output,
    },
    async load({filePath, log}) {
      const cmdWithFile = cmd.replace('$FILE', filePath);
      const contents = await fs.readFile(filePath, 'utf-8');
      try {
        const {stdout, stderr} = await execa.command(cmdWithFile, {
          env: npmRunPath.env(),
          extendEnv: true,
          shell: true,
          input: contents,
          cwd,
        });
        if (stderr) {
          log('WORKER_MSG', {level: 'warn', msg: stderr});
        }
        return {[output[0]]: stdout};
      } catch (err) {
        log('WORKER_MSG', {level: 'error', msg: err.stderr});
        log('WORKER_UPDATE', {state: ['ERROR', 'red']});
        return null;
      }
    },
  };
};

export default buildScriptPlugin;
