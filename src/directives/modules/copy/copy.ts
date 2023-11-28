import { notify } from "@/utils/message/MessageUtils"

/* 
  hsc
  @since 2023-11-28 16:47:13
  @see https://juejin.cn/post/6948614313582002212
*/
export default {
  name: 'copy',
  directive: {
      // 绑定元素的父组件被挂载时调用
      mounted(el, { value }) {
          el.$value = value
          el.handler = () => {
              //NO1 值为空时提示
              if (!el.$value) {
                  console.log('复制内容为空')
                  return false
              }
              // NO2 利用textarea标签实现copy
              /**
               * 创建一个textarea，然后将textarea设为readonly，防止ios下自动换气键盘，
               * 最后将textarea移出可视区
              */
              const textarea = document.createElement('textarea')
              textarea.readonly = 'readonly'
              textarea.style.position = 'absolute'
              textarea.style.left = '-9999px'
              /**
               * 将要copy的值赋给textarea的value属性
              */
              textarea.value = el.$value
              /**
               * 将textarea 插入到body中
              */
              document.body.appendChild(textarea)
              /**
               * 实现选中并复制
               * 利用select选中，
               * 利用execCommand命令copy选中的内容到剪贴板中
              */
              textarea.select()
              textarea.setSelectionRange(0, textarea.value.length)
              const result = document.execCommand('Copy')
              if (result) {
                    notify.success('系统提示',`${el.$value}复制成功`,true)
        
                  console.log(`${el.$value}复制成功`);
              }
              /**
               * 移出textarea
              */
              document.body.removeChild(textarea)
          }
          el.addEventListener('click', el.handler)
      },
      // 当传进来的值更新的时候触发
      updated(el, { value }) {
          el.$value = value
      },
      // 指令与元素解绑的时候，移除事件绑定
      unmounted(el) {
          el.removeEventListener('click', el.handler)
      }
  }
}
