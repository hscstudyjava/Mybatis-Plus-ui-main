<template>
    <div class="app-context">


        <notifyBar mode="closeable" color="var(--el-color-success)" background="var(--el-color-success-light-9)"
            text="对于父路由的路径需要有 /，子路由的路径可以不填写 /。例如，父路由可以是 /system，子路由可以是 user，不需要写成 /system/user。" rightIcon="ep:close"
            leftIcon="ep:bell" />

        <br />

        <notifyBar mode="closeable" color="var(--el-color-success)" background="var(--el-color-success-light-9)"
            text=" 动态数据路由(/xx/xx/{id})这个模式,建议操作人员使用的时候使用嵌套进行新增比如(/system/dict)类型与数据,我们想类型去查询匹配的数据页面这样我们应该这样字典类型(/system/dict/type)跳转(/system/dict/value/{typeId}),注意{typeId}是动态的需要判断用户是否有么有这个权限才可以跳转"
            rightIcon="ep:close" leftIcon="ep:bell" />
        <el-row>

            <br />


            <el-col :span="24">
                <!-- 真的建议各位使用unocss真的很好用!!!! -->
                <el-card class="box-card mt-2">
                    <el-form v-show="state.showQuery" :inline="true" :model="state.params" class="demo-form-inline"
                        @submit.native.prevent>
                        <el-form-item label="菜单名称">
                            <el-input v-model="state.params.permissionName" placeholder="请输入菜单名称"
                                @keyup.enter.native="loadList" clearable />
                        </el-form-item>

                        <el-form-item label="角色字符">
                            <el-input v-model="state.params.permissionValue" placeholder="请输入角色字符"
                                @keyup.enter.native="loadList" clearable />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="loadList">查询</el-button>
                            <el-button @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 表单数组 -->
                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5" v-peri="[basePeri + 'save']">
                            <!-- @click="handleInsert(ruleFormRef)" -->
                            <el-button type="success" plain @click="handleSave('0')">
                                <template #icon>
                                    <el-icon>
                                        <i-ep-Plus />
                                    </el-icon>
                                </template>
                                新增
                            </el-button>
                        </el-col>

                        <el-col :span="1.5">
                            <el-button type="warning" plain @click="toggleExpansion()">
                                <template #icon>
                                    <i-ep-Switch />
                                </template>
                                展开</el-button>
                        </el-col>

                        <rightQuery :query="state.showQuery" @toggleQuery="toggleQuery" @refresh="loadList" />

                    </el-row>
                </el-card>

                <el-card class="mt-10">

                    <el-table ref="treeTableRef" stripe border v-loading="state.loading" :data="state.list"
                        style="width: 100%" row-key="id" lazy
                        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                        <el-table-column prop="permissionName" show-overflow-tooltip align="center" label="权限名称" />
                        <el-table-column prop="permissionValue" show-overflow-tooltip align="center" label="权限字符" />
                        <el-table-column prop="menuPath" show-overflow-tooltip align="center" label="跳转路径" />
                        <el-table-column prop="menuComponent" align="center" show-overflow-tooltip label="菜单路径" />
                        <el-table-column label="Icon" align="center">
                            <template #default="scope">
                                <svg-icon :icon="scope.row.menuIcon" />
                            </template>
                        </el-table-column>
                        <el-table-column label="权限类型" align="center">
                            <template #default="scope">
                                <el-tag v-if="scope.row.permissionType === 'P'" type="success">权限</el-tag>
                                <el-tag v-else-if="scope.row.permissionType === 'M'" type="warning">菜单</el-tag>
                                <el-tag v-else>路由</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="200px">
                            <template #default="socpe">
                                <el-button link v-peri="[`${basePeri}save`]" type="success"
                                    @click="handleSave(socpe.row.id)">
                                    <template #icon>
                                        <el-icon>
                                            <i-ep-plus />
                                        </el-icon>
                                    </template>
                                    新增
                                </el-button>

                                <el-button link v-peri="[`${basePeri}update`]" @click="handleUpdate(socpe.row.id)"
                                    type="primary">
                                    <template #icon>
                                        <el-icon>
                                            <i-ep-Edit />
                                        </el-icon>
                                    </template>
                                    更新
                                </el-button>

                                <!-- 判断一下是否两个条件任意一个成立 -->
                                <template v-if="socpe.row.permissionType === 'R' || socpe.row.children.length === 0">
                                    <el-dropdown @command="handleCommand($event, socpe.row)" teleported>

                                        <el-button link>
                                            更多
                                        </el-button>

                                        <template #dropdown>
                                            <el-dropdown-menu>

                                                <template v-peri="[`${basePeri}createPermission`]"
                                                    v-if="socpe.row.permissionType === 'R'">
                                                    <el-dropdown-item command="generation">一键生成</el-dropdown-item>
                                                </template>


                                                <template v-peri="[`${basePeri}remove`]"
                                                    v-if="socpe.row.children.length === 0">
                                                    <el-dropdown-item command="remove">删除数据</el-dropdown-item>
                                                </template>


                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </template>



                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>



        <!--新增OR更新 -->
        <el-dialog v-model="state.firstDialog.open" :title="state.firstDialog.title" width="50%" draggable>
            <el-form :model="state.form" status-icon label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单">
                            <el-tree-select style="width:100%" v-model="state.form.parentId" node-key="id"
                                :data="state.submitSimpleList" check-strictly :render-after-expand="false" />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12>
                        <el-form-item prop="permissionValue">
                            <template #label>
                                <span>
                                    权限类型
                                    <el-tooltip placement="top">
                                        <template #content>权限类型 P=按钮级别,M=菜单,R=路由</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-select style="width:100%" v-model="state.form.permissionType" class="m-2"
                                placeholder="Select">
                                <el-option v-for="item in permissionType" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>

                    </el-col>

                    <el-col :span=12>
                        <el-form-item prop="permissionName">
                            <template #label>
                                <span>
                                    权限名称
                                    <el-tooltip placement="top">
                                        <template #content>权限名称用于菜单名称 必须填写</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-input v-model="state.form.permissionName" placeholder="请填写权限名称" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'M'">
                        <el-form-item prop="menuIcon">
                            <template #label>
                                <span>
                                    Icon
                                    <el-tooltip placement="top">
                                        <template #content>Icon</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <icon-select v-model="state.form.menuIcon" placeholder="请填写Icon" />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'P'">
                        <el-form-item prop="permissionValue">
                            <template #label>
                                <span>
                                    权限字符
                                    <el-tooltip placement="top">
                                        <template #content>权限字符用于权限管理 必须填写(system:permission:save)</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-input v-model="state.form.permissionValue" placeholder="请填写权限字符" clearable />
                        </el-form-item>
                    </el-col>


                    <el-col :span=12>
                        <el-form-item prop="sortValue">
                            <template #label>
                                <span>
                                    排序值
                                    <el-tooltip placement="top">
                                        <template #content>排序值用于在菜单进行数据排序</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-input-number v-model="state.form.sortValue" style="width: 100%;" :min="0" :max="1000"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'M'">
                        <el-form-item prop="menuPath">
                            <template #label>
                                <span>
                                    跳转路径
                                    <el-tooltip placement="top">
                                        <template #content>跳转路径(支持系统跳转以及Https || iframe)</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-input v-model="state.form.menuPath" placeholder="请填写跳转路径" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'M'">
                        <el-form-item prop="menuComponent">
                            <template #label>
                                <span>
                                    组件路径
                                    <el-tooltip placement="top">
                                        <template #content>默认填写为Views下的文件(index切记须填写)</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-input v-model="state.form.menuComponent" placeholder="请填写组件路径" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span=12 v-show="state.form.permissionType === 'R'">
                        <el-form-item prop="menuParam">
                            <template #label>
                                <span>
                                    路由参数
                                    <el-tooltip placement="top">
                                        <template #content>跳转路由时默认携带参数如(url?id=1&name=xx)</template>
                                        <svg-icon iconClass="question"></svg-icon>
                                    </el-tooltip>
                                </span>
                            </template>
                            <el-input v-model="state.form.menuParam" placeholder="请填写组件参数" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span=8 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'M'">
                        <el-form-item prop="hasHidden" label="菜单隐藏">
                            <el-switch v-model="state.form.hasHidden" />
                        </el-form-item>
                    </el-col>

                    <el-col :span=8 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'M'">
                        <el-form-item prop="hasCache" label="是否缓存">
                            <el-switch v-model="state.form.hasCache" />
                        </el-form-item>
                    </el-col>
                    <el-col :span=8 v-show="state.form.permissionType === 'R' || state.form.permissionType === 'M'">
                        <el-form-item prop="hasCache" label="内联网页">
                            <el-switch v-model="state.form.hasFrame" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <span class="dialog-footer">

                    <el-button @click="cancel">
                        <template #icon>
                            <el-icon>
                                <i-ep-Refresh />
                            </el-icon>
                        </template>
                        取消
                    </el-button>

                    <el-button type="primary" @click="submit">
                        <template #icon>
                            <el-icon>
                                <i-ep-Pointer />
                            </el-icon>
                        </template>
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 一键生成 -->
        <el-dialog v-model="state.firstDialog.openGeneration" :title="state.firstDialog.title" width="50%" draggable>
            <el-form :model="state.form" status-icon label-width="100px">
                <el-form-item>
                    <template #label>
                        <span>
                            菜单名称
                        </span>
                    </template>
                    <el-input v-model="state.generationForm.prefixName" />
                </el-form-item>

                <el-form-item>
                    <template #label>
                        <span>
                            权限前缀
                        </span>
                    </template>
                    <el-input v-model="state.generationForm.prefix" placeholder="请输入权限前缀" clearable />
                </el-form-item>

                <el-form-item prop="hasInsert" label="是否新增">
                    <el-switch v-model="state.generationForm.hasInsert" />
                </el-form-item>
                <el-form-item prop="hasUpdate" label="是否更新">
                    <el-switch v-model="state.generationForm.hasUpdate" />
                </el-form-item>
                <el-form-item prop="hasPage" label="是否分页">
                    <el-switch v-model="state.generationForm.hasPage" />
                </el-form-item>

                <el-form-item prop="hasRemove" label="是否删除">
                    <el-switch v-model="state.generationForm.hasRemove" />
                </el-form-item>

                <el-form-item prop="hasLead" label="是否导入">
                    <el-switch v-model="state.generationForm.hasLead" />
                </el-form-item>



            </el-form>
            <template #footer>
                <span class="dialog-footer">

                    <el-button @click="cancel">
                        <template #icon>
                            <el-icon>
                                <i-ep-Refresh />
                            </el-icon>
                        </template>
                        取消
                    </el-button>

                    <el-button type="primary" @click="generationPeri">
                        <template #icon>
                            <el-icon>
                                <i-ep-Pointer />
                            </el-icon>
                        </template>
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="SystemPermission">
import { onMounted, reactive, ref } from 'vue';
import { queryPermissionAllTree, basePeri, permissionType, queryPermissionSimple, insertPermission, updatePermission, getPermissionInfoById, removePermission, generationPermission } from '@/api/system/permission'
import type { SysPermisson, SimpleTree } from '@/api/system/type';
import { confirms, messages } from '@/utils/message/MessageUtils';
const treeTableRef = ref(null);//注册

const state = reactive({

    showQuery: false,

    expandAll: false,

    loading: false,



    list: [] as SysPermisson[],

    simpleList: [] as SimpleTree<SysPermisson>[],

    submitSimpleList: [] as SimpleTree<SysPermisson>[],


    generationForm: {
        id: null,
        prefix: "",
        prefixName: "",
        hasInsert: true,
        hasUpdate: true,
        hasRemove: true,
        hasPage: true,
        hasLead: true,
    },

    params: {
        permissionName: "",
        permissionValue: "",
        permissionType: "",
        menuIcon: "",
        menuPath: "",
        menuParam: "",
        hasHidden: false,
        hasCache: false,
        hasFrame: false,
        status: "",
        sortValue: "",
        id: "",
        children: [],
        parentId: null,
        label: "",
        menuComponent: ''
    } as SysPermisson,

    // 第一个弹窗
    firstDialog: {
        open: false,
        openGeneration: false,
        title: ''
    },



    // 填充表单
    form: {
        menuComponent: '',
        permissionName: "",
        permissionValue: "",
        permissionType: "",
        menuIcon: "",
        menuPath: "",
        menuParam: "",
        status: "",
        sortValue: "",
        id: null,
        parentId: null,
        label: "",
        children: [],
        hasHidden: false,
        hasCache: false,
        hasFrame: false
    } as SysPermisson
})

const handleDelete = (row: SysPermisson) => {
    if (row.id) {
        confirms
            .confirm(`您是否删除${row.permissionName}菜单数据`)
            .then((res) => {
                removePermission(row.id as string).then((res) => {
                    let data = res.data
                    if (data.success) { messages.success(data.success, true, true) } else { messages.error(data.error, true, true) }
                    loadList();
                });
            })
    }
}

const handleCommand = (type: string, row: SysPermisson) => {
    switch (type) {
        case 'remove':
            handleDelete(row)
            break;

        case 'generation':
            state.firstDialog.openGeneration = true;
            state.firstDialog.title = "生成权限"
            Object.assign(state.form, row)
            Object.assign(state.generationForm, {
                id: row.id,
                prefix: "",
                prefixName: row.permissionName,
                hasInsert: true,
                hasUpdate: true,
                hasRemove: true,
                hasPage: true,
                hasLead: true,
            })
            break

        default:
            break;
    }

}

// @ts-ignore
const TabData = (data, status) => {  //循环数据赋值
    // @ts-ignore
    data.forEach((i) => {
        // @ts-ignore
        treeTableRef.value.toggleRowExpansion(i, status)
        if (i.children) {
            forArr(i.children, status);
        }
    });
}
// @ts-ignore
const forArr = (arr, status) => {     //关闭展开逻辑
    // @ts-ignore
    arr.forEach((i) => {
        // @ts-ignore
        treeTableRef.value.toggleRowExpansion(i, status)
        if (i.children) {
            forArr(i.children, status);
        }
    });
};

const toggleExpansion = () => {   //展开
    // 重新赋值给expandAll
    state.expandAll = !state.expandAll
    TabData(state.list, state.expandAll);
}


/***********操作表单************ */
const handleSave = (id: string | number) => {

    state.firstDialog.open = true;
    state.firstDialog.title = "新增权限"

    /** 
     * 实例化
     */
    let insertForm: SysPermisson = {
        permissionName: "",
        permissionValue: "",
        permissionType: "M",
        menuIcon: "",
        menuPath: "",
        menuParam: "",
        status: "",
        sortValue: 0,
        id: "",
        parentId: id,
        label: "",
        children: [],
        menuComponent: ''
    }

    Object.assign(state.form, insertForm)
}

const handleUpdate = (id: string | number) => {
    state.firstDialog.open = true;
    state.firstDialog.title = "更新权限"
    getPermissionInfoById(id).then(res => {
        Object.assign(state.form, res.data)
    })
}

const loadList = () => {
    state.loading = true
    queryPermissionAllTree(state.params).then(res => {
        state.list = res.data
        state.loading = false
    })

}

const loadingPermission = () => {
    // 重置数据
    state.simpleList = [];
    state.submitSimpleList = []
    queryPermissionSimple().then(res => {
        let parentObj: SimpleTree<SysPermisson> = {
            id: '0',
            parentId: '',
            label: '主类目',
            children: [] as Array<SysPermisson>
        }
        // @ts-ignore
        parentObj.children = res.data;
        state.submitSimpleList.push(parentObj)
        state.simpleList = res.data
    })
}

const generationPeri = () => {
    generationPermission(state.generationForm).then(res => {
        messages.success(res.msg),
            cancel();
        loadList()
    })

}

/** 
 * 取消提交
 */
const cancel = () => {
    state.firstDialog.open = false;
    state.firstDialog.openGeneration = false;

    // 重置提交表单中的数据
    /** 
    * 实例化
    */
    let insertForm: SysPermisson = {
        permissionName: "",
        permissionValue: "",
        permissionType: "M",
        menuIcon: "",
        menuPath: "",
        menuParam: "",
        status: "",
        sortValue: 0,
        id: "",
        parentId: "",
        label: "",
        children: [],
        menuComponent: ''
    }

    Object.assign(state.form, insertForm)
    Object.assign(state.generationForm, {
        id: null,
        prefix: "",
        prefixName: "",
        hasInsert: true,
        hasUpdate: true,
        hasRemove: true,
        hasPage: true,
        hasLead: true,
    })
}


const submit = () => {
    if (state.form.id) {
        updatePermission(state.form).then(res => {
            messages.success(res.msg)
            state.firstDialog.open = false;
            loadList()
            loadingPermission();
        }).catch(error => {
            messages.error(error.msg)
            state.firstDialog.open = false;
        })
    } else {
        insertPermission(state.form).then(res => {
            messages.success(res.msg)
            state.firstDialog.open = false;
            loadList();
            loadingPermission();
        }).catch(error => {
            messages.error(error.msg)
            state.firstDialog.open = false;
        })
    }

}

const resetQuery = () => {
    let newParams: SysPermisson = {
        permissionName: "",
        permissionValue: "",
        permissionType: "",
        menuIcon: "",
        menuPath: "",
        menuParam: "",
        hasHidden: false,
        hasCache: false,
        hasFrame: false,
        status: "",
        sortValue: "",
        id: "",
        children: [],
        parentId: null,
        label: ""
    }
    Object.assign(state.params, newParams)
    console.log(state.params);

    loadList()
}

const toggleQuery = () => {
    state.showQuery = !state.showQuery
}
onMounted(() => {
    loadList()
    loadingPermission()
})

</script>

<style scoped lang="scss">
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>
