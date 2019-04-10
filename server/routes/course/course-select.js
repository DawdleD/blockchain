function getCourseSql(system, type, filter, sort, page, isCount) {
    //查询课程
    let systemExist = (system !== undefined && !isNaN(parseInt(system)));
    let typeExist = (type !== undefined && !isNaN(parseInt(type)));
    let filterExist = filter !== undefined;
    let sortExist = sort !== undefined;
    if (page === undefined) page = 1;
    let pageExist = !isNaN(parseInt(page));
    const select = `select ${isCount ? 'count(*)' : '*'} from CourseInformation`;
    const systemSql = `SystemID = ?`;  //所有体系ID为..的课程
    const typeSql = `TypeID = ?`; //所有类别ID为..的课程
    const filterSql = {
        "1": `Price = 0`,  //所有免费课程
        "2": `Price > 0`,  //所有付费课程
        "3": `CourseForm = 'L'`,  //所有直播课程
        "4": `CourseForm = 'R'`  //所有录播课程
    };
    const sortSql = {
        "1": `FavorableRate desc`,  //所有课程按照好评率排序
        "2": `ApplyCount desc`,  //所有课程按照人气排序
        "3": `Price desc`,  //所有课程按照价格从高到低
        "4": `Price`   //所有课程按照价格从低到高
    };
    let cmd = `select ${isCount ? 'count(*)' : '*'} from CourseInformation`;
    if (systemExist) cmd = `${select} where ${systemSql}`;
    if (systemExist && typeExist) cmd = `${cmd} and ${typeSql}`;
    if (filterExist && filterSql[filter] !== undefined) cmd = `${cmd} ${select === cmd ? 'where' : 'and'} ${filterSql[filter]}`;
    if (sortExist && sortSql[sort] !== undefined && !isCount) cmd = `${cmd} order by ${sortSql[sort]}`;
    if (pageExist) cmd = `${cmd} limit ${10 * (parseInt(page) - 1)},10`;
    return cmd;
}

module.exports = {getCourseSql};
