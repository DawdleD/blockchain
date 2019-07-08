<template>
    <div id="container">
        <header-course :page="page"></header-course>
        <router-view></router-view>
        <footer-course></footer-course>
    </div>
</template>

<script>
    import Header from '../../components/common/Header'
    import Footer from '../../components/common/Footer'

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
    a {
        color: #333;
        cursor: pointer;
        text-decoration: none;
    }

    a:hover {
        color: #409eff;
        text-decoration: none;
    }

    li {
        clear: none;
        list-style: none;
    }

    .course-all {
        min-height: 700px;
        padding-left: 15px;
        padding-right: 15px;
        clear: both;
    }

    .course-information{
        background-color: #f5f5f5;
        min-height: 700px;
        clear: both;
    }

    .clearfix:after {
        content: "";
        display: table;
        clear: both;
    }

</style>
