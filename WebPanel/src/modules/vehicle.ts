import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    owner: String,
    vehicle: String,
    access: Array<String>,
    date: String
};

const UserSchema: Schema = new Schema({
    owner: String,
    vehicle: String,
    access: Array,
    date: String
});

const model = mongoose.model<IApplication>('vehicle', UserSchema);

class ApplicationHandler {
    async get(findBy: Object) {
        return await model.findOne(findBy)
    };

    async getAll(findBy: Object) {
        return await model.find(findBy)
    };

    async delete(findBy: Object) {
        return await model.findOneAndDelete(findBy)
    };

    async new(data: {
        owner: String,
        vehicle: String,
        access: Array<String>,
        date: any
    }) {
        const newModel = new model(data);
        newModel.save();
    };

    async update(findBy: object, data: object) {
        return await model.findOneAndUpdate(findBy, data);
    };
};

export default {
    model: model,
    get: (new ApplicationHandler).get,
    getAll: (new ApplicationHandler).getAll,
    delete: (new ApplicationHandler).delete,
    new: (new ApplicationHandler).new,
    update: (new ApplicationHandler).update
};