<template>
    <div class="course-bread">
        <span @click="chooseAll">
            <router-link to="/course/list">全部课程</router-link>
        </span>
        <span v-if="bread['systemName']">
            <i class="fas fa-angle-right"></i>
            <span @click="chooseSystem">
                <router-link :to="bread['systemUrl']">{{bread['systemName']}}</router-link>
            </span>
        </span>
        <span v-if="bread['typeName']">
            <i class="fas fa-angle-right"></i>
            <router-link :to="bread['typeUrl']">{{bread['typeName']}}</router-link>
        </span>
        <span v-if="bread['courseName']">
            <i class="fas fa-angle-right"></i>
            <router-link :to="bread['courseUrl']">{{bread['courseName']}}</router-link>
        </span>
    </div>
</template>

<script>
    export default {
        name: "CourseBread",
        props: {
            bread: {type: Object, required: true}
        },
        methods: {
            chooseAll() {
                this.bread['systemName'] = false;
                this.bread['typeName'] = false;
                this.bread['courseName'] = false;
            },
            chooseSystem() {
                this.bread['typeName'] = false;
                this.bread['courseName'] = false;
            }
        }
    }
</script>

<style>
    .course-bread {
        margin-top: 30px !important;
        font-size: 14px;
        text-align: left;
    }

    .course-bread a {
        color: #333333;
        cursor: pointer;
    }

    .course-bread a:hover {
        text-decoration: none;
        color: #409eff;
    }

    .course-bread span {
        color: #999999;
    }

    .course-bread i {
        margin: 0 10px;
    }
</style>
