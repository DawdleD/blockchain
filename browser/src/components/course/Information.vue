<template>
    <div class="content">
        <course-bread :bread="bread"></course-bread>
        <div class="course-banner"></div>
    </div>
</template>

<script>
    import CourseBread from './CourseBread'

    export default {
        name: "Information",
        data() {
            return {
                bread: {
                    systemName: 'IT·互联网',
                    systemUrl: '',
                    typeName: '前端设计',
                    typeUrl: '',
                    courseName: 'Vue教程',
                    courseUrl: ''
                }
            }
        },
        components: {
            'course-bread': CourseBread
        }
    }
</script>

<style scoped>

</style>
