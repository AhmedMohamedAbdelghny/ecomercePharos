


export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }

    //pagination
    pagination() {
        let page = this.queryString.page * 1 || 1
        if (page < 0) page = 1
        let limit = 1
        let skip = (page - 1) * limit
        this.mongooseQuery.skip(skip).limit(limit)
        this.page = page
        return this
    }

    //filter
    filter() {
        const excludeQuery = ["page", "sort", "select", "search"]
        let queryString = { ...this.queryString }
        excludeQuery.forEach((e) => {
            delete queryString[e]
        })
        queryString = JSON.parse(JSON.stringify(queryString).replace(/(gt|lt|gte|lte)/, (m) => `$${m}`))
        this.mongooseQuery.find(queryString)
        return this

    }


    //sort
    sort() {
        if (this.queryString?.sort) {
            this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "))
        }
        return this
    }

    //select
    select() {
        if (this.queryString?.select) {
            this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "))
        }
        return this
    }

    //search
    search() {
        if (this.queryString?.search) {
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.queryString?.search, $options: "i" } },
                    { description: { $regex: this.queryString?.search, $options: "i" } }
                ]
            })
        }
        return this
    }





}



// new ApiFeatures()

