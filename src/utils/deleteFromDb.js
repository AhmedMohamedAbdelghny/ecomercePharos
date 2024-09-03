


export const deleteFromDb = async (req, res, next) => {
    if (req?.data) {
        const { model, id } = req.data
        await model.findByIdAndDelete(id)
    }
}