<template>
    <div id="container">
        <header-course :page="page"></header-course>
        <div class="course-all">
            <div class="course-bread">
                <a>全部课程</a>
                <span><i class="fas fa-angle-right"></i></span>
                <a>计算机</a>
            </div>
            <router-view></router-view>
        </div>
        <footer-course></footer-course>
    </div>
</template>

<script>
    import Header from '../components/common/Header'
    import Footer from '../components/common/Footer'

    export default {
        name: "Course",
        data() {
            return {
                page: "course"
            }
        },
        components: {
            "header-course": Header,
            "footer-course": Footer
        }
    }
</script>

<style>
    #container {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding-bottom: 245px;
        box-sizing: border-box;
    }

    .course-all {
        width: 1200px;
        min-height: 700px;
        margin-right: auto;
        margin-left: auto;
        padding-left: 15px;
        padding-right: 15px;
    }

    .course-all .course-bread {
        margin-top: 30px !important;
        font-size: 14px;
        text-align: left;
    }

    .course-all .course-bread a {
        color: #333333;
        cursor: pointer;
    }

    .course-all .course-bread a:hover {
        text-decoration: none;
        color: #409eff;
    }

    .course-all .course-bread span{
        color: #999999;
    }

    .course-all .course-bread i{
        margin: 0 10px;
    }


</style>
