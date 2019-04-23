<template>
    <div id="container">
        <header-course :page="page"></header-course>
        <router-view></router-view>
        <footer-course></footer-course>
    </div>
</template>

<script>
    import Header from '../components/common/Header'
    import Footer from '../components/common/Footer'

    export default {
        name: "Project",
        data() {
            return {
                page: "project"
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
