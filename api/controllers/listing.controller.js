const listingModel = require('../models/listing.model.js');

const createListing = async(req,res)=>{
    try {
        const listing = await listingModel.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

module.exports = createListing;