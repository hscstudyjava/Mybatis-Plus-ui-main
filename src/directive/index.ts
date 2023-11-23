// index.ts
import type { App } from 'vue';
import type { DirectiveOptions, Keys } from './type';

export default async function directives(app: App) {
    // 项目是用 vite 创建，import.meta.glob 用于导入 /modules 下所有指令实现代码
    const files = import.meta.glob('./modules/*/*.ts');
    for (const key in files) {
        const file: any = await files[key]();
        if (file) {
            const direct = file.default as DirectiveOptions<Keys>;
            
            app.directive(direct.name, direct.directive);
        }
    }
}
