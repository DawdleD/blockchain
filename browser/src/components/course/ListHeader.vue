<template>
    <div>
        <course-bread :bread="bread"></course-bread>
        <!--课程分类 S-->
        <div class="course-header">
            <!--课程体系 S-->
            <div class="course-system">
                <ul>
                    <li>
                        <router-link to="/course/list">
                            <span :class="{'system-name':true, current:$route.query.system === undefined}">全部课程</span>
                        </router-link>
                    </li>
                    <li v-for="system in systems" :key="system.id">
                        <router-link :to="`${$route.path}?system=${system.id}`">
                        <span :class="{'system-name':true, current:system.id.toString() === $route.query.system}">
                            {{system.name}}
                        </span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <!--课程体系 E-->
            <!--课程类别 S-->
            <div class="course-type" v-if="$route.query.system !== undefined">
                <ul>
                    <li>
                        <router-link :to="`${$route.path}?system=${$route.query.system}`">
                            <span :class="{current:$route.query.type === undefined}">全部</span>
                        </router-link>
                    </li>
                    <li v-for="type in types" :key="type.id">
                        <router-link :to="`${$route.path}?system=${$route.query.system}&type=${type.id}`">
                        <span :class="{current:type.id.toString() === $route.query.type}">
                            {{type.name}}
                        </span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <!--课程类别 E-->
        </div>
        <!--课程分类 E-->
    </div>
</template>

<script>
    import CourseBread from './CourseBread'

    export default {
        name: "ListHeader",
        data() {
            return {
                bread: {
                    systemName: false,
                    systemUrl: false,
                    typeName: false,
                    typeUrl: false,
                    courseName: false
                },
                systems: null,
                types: null
            }
        },
        components: {
            "course-bread": CourseBread
        },
        computed: {
            setType() {
                return this.$route.query.system;
            },
            getType() {
                return this.$route.query.type;
            }
        },
        methods: {
            /**
             * 体系改变时传递体系名
             * @param system 选择的体系ID
             */
            systemChange(system) {
                this.bread.systemName = this.systems.find((x) => {
                    return x.id === parseInt(system);
                }).name;
                document.title = this.bread.systemName;
                this.bread.systemUrl = `/course/list?system=${system}`;
                this.bread.typeName = false;
                this.bread.courseName = false;
            },
            /**
             * 类别改变时传递类别名
             * @param type 选择的类别ID
             */
            typeChange(type) {
                this.bread.typeName = this.types.find((x) => {
                    return x.id === parseInt(type);
                }).name;
                document.title = this.bread.typeName;
                this.bread.typeUrl = `/course/list?system=${this.$route.query.system}&type=${type}`;
                this.bread.courseName = false;
            }
        },
        watch: {
            /**
             * 监视体系变化，变化后设置其类别
             * @param val
             */
            setType(val) {
                if (val !== undefined) {
                    this.systemChange(val);
                    this.$axios.get(`/api/course/list/type?system=${val}`).then((response) => {
                        if (response.data.status === 1) this.types = response.data.data;
                        else console.log(response.data.message)
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    this.bread.systemName = false;
                    this.bread.typeName = false;
                    this.bread.courseName = false;
                }
            },
            /**
             * 监视类别变化
             * @param val
             */
            getType(val) {
                if (val !== undefined) {
                    this.typeChange(val);
                }
            }
        },
        created() {
            this.$axios.get('/api/course/list/system').then((response) => {
                if (response.data.status === 1) {
                    this.systems = response.data.data;
                    if (this.$route.query.system !== undefined) {
                        this.systemChange(this.$route.query.system);
                        this.$axios.get(`/api/course/list/type?system=${this.$route.query.system}`).then((response) => {
                            if (response.data.status === 1) {
                                this.types = response.data.data;
                                if (this.$route.query.type !== undefined)
                                    this.typeChange(this.$route.query.type);
                            } else console.log(response.data.message)
                        })
                    }
                } else console.log(response.data.message)
            }).catch((err) => {
                console.log(err);
            });
        }
    }
</script>

<style src="../../assets/css/course-list.css"></style>

