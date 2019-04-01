<template>
    <div id="container">
        <header-course :page="page"></header-course>
        <footer-course></footer-course>
    </div>
</template>

<script>
    import Header from '../../components/student/Header'
    import Footer from '../../components/student/Footer'

    export default {
        name: "CourseList",
        data(){
            return{
                page:"course"
            }
        },
        components: {
            "header-course": Header,
            "footer-course": Footer
        }
    }
</script>

<style scoped>
    #container{
        position:relative;
        width:100%;
        min-height:100%;
        padding-bottom: 245px;
        box-sizing: border-box;
    }
</style>
