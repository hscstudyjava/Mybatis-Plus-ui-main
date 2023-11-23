declare module 'vue' {
    interface ComponentCustomProperties {
        $msg: (key: string) => void
    }
}