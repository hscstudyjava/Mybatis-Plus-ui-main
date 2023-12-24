<script  lang="ts">
import { h } from 'vue';
import svgIcon from '@/components/svgIcon/index.vue'
import { ElIcon } from 'element-plus';
interface MenuItemProps {
    icon: string;
    title: string;
}

export default {
    props: {
        icon: String,
        title: String,
    },
    setup(props) {
        return () => {
            const { icon, title } = props;
            const vnodes = [];
            if (icon) {
                vnodes.push(
                    h(svgIcon, { icon: icon })
                );
            }
            if (title) {
                if (title.length > 5) {
                    vnodes.push(
                        h('span', {  class:"title" }, title)
                    );
                } else {
                    vnodes.push(
                        h('span', { class:'title'}, title)
                    );
                }
            }
            return vnodes;
        }
    }
};
</script>