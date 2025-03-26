/**
 * Class to handle API features like filtering, sorting, selecting fields, and pagination
 */
class APIFeatures {
    /**
     * Initialize with a Mongoose query and request query object
     * @param {Object} query - Mongoose query
     * @param {Object} requestQuery - Express request.query object
     */
    constructor(query, requestQuery) {
      this.query = query;
      this.requestQuery = requestQuery;
    }
  
    /**
     * Filter the query based on request parameters
     * @returns {APIFeatures} - Returns this for chaining
     */
    filter() {
      // Create a copy of the request query
      const queryObj = { ...this.requestQuery };
  
      // Fields to exclude from filtering
      const excludedFields = ['select', 'sort', 'page', 'limit', 'populate'];
      excludedFields.forEach(field => delete queryObj[field]);
  
      // Create operators like $gt, $gte, etc.
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
      // Set the filtered query
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    /**
     * Sort results based on sort parameter
     * @returns {APIFeatures} - Returns this for chaining
     */
    sort() {
      if (this.requestQuery.sort) {
        const sortBy = this.requestQuery.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        // Default sort by creation date, descending
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    /**
     * Limit fields returned in response
     * @returns {APIFeatures} - Returns this for chaining
     */
    limitFields() {
      if (this.requestQuery.select) {
        const fields = this.requestQuery.select.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        // Exclude the version field by default
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    /**
     * Implement pagination
     * @returns {APIFeatures} - Returns this for chaining
     */
    paginate() {
      // Default values
      const page = parseInt(this.requestQuery.page, 10) || 1;
      const limit = parseInt(this.requestQuery.limit, 10) || 25;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  
    /**
     * Populate referenced fields if requested
     * @returns {APIFeatures} - Returns this for chaining
     */
    populate() {
      if (this.requestQuery.populate) {
        const fields = this.requestQuery.populate.split(',');
        fields.forEach(field => {
          this.query = this.query.populate(field);
        });
      }
  
      return this;
    }
  }
  
  module.exports = APIFeatures;