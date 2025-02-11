import ModuleType from 'packages/module/types/ModuleType.ts';

export class ModuleMap extends Map<string | symbol, ModuleType> { }

export default ModuleMap