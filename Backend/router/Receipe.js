const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../configuration/cloudinary');
const upload = multer({ storage });

// Import auth middleware from auth routes
const auth = require('../middleware/auth')

const BK = require('../models/BreakFast');
const LN = require('../models/Lunch');
const SN = require('../models/Snacks');
const DN = require('../models/Dinner');

// Helper function to reduce code duplication
const createRecipeHandler = (Model) => async (req, res) => {
    const { title, ingredients, how_to } = req.body;

    try {
        if (!title || !ingredients || !how_to || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newRecipe = new Model({
            title,
            image: req.file.path, // Cloudinary URL
            author: req.user._id, // FIXED: Use _id consistently
            ingredients,
            how_to
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });

    } catch (error) {
        console.error('Create recipe error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Helper function for getting all recipes (public)
const getAllRecipesHandler = (Model) => async (req, res) => {
    try {
        const recipes = await Model.find().populate('author', 'username email');
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Get all recipes error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// FIXED: Now properly handles user authentication
const getSpecificUserRecipeHandler = (Model) => async(req,res)=> {
    try {
        // req.user is guaranteed to exist due to auth middleware
        const recipes = await Model.find({author: req.user._id});
        if(!recipes || recipes.length === 0){
            return res.status(404).json({message: "No Recipes Found Here."});
        }
        res.status(200).json({message: "Here are your recipes", recipes});
        
    } catch (error) {
        console.error('Get user recipes error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getSingleRecipeHandler = (Model) => async(req,res)=> {
    const {id} = req.params;

    try {
        const recipe = await Model.findById(id).populate('author', 'username email');
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(recipe);
        
    } catch (error) {
        console.error('Get single recipe error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Helper function for deleting recipes
const deleteRecipeHandler = (Model) => async (req, res) => {
    const { id } = req.params;

    try {
        // Find the recipe first to check ownership
        const recipe = await Model.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // FIXED: Use _id consistently for comparison
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own recipes" });
        }

        // Delete the recipe
        await Model.findByIdAndDelete(id);
        res.status(200).json({ message: "Recipe deleted successfully" });

    } catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Helper function for updating recipes
const updateRecipeHandler = (Model) => async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, how_to } = req.body;

    try {
        // Find the recipe first to check ownership
        const recipe = await Model.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // FIXED: Use _id consistently for comparison
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own recipes" });
        }

        // Prepare update data
        const updateData = {
            ...(title && { title }),
            ...(ingredients && { ingredients }),
            ...(how_to && { how_to }),
            ...(req.file && { image: req.file.path }) // Update image only if new file uploaded
        };

        // Update the recipe
        const updatedRecipe = await Model.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: "Recipe updated successfully", recipe: updatedRecipe });

    } catch (error) {
        console.error('Update recipe error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// BREAKFAST ROUTES - FIXED: Added auth middleware where needed
router.post('/add/breakfast', auth, upload.single('image'), createRecipeHandler(BK));
router.get('/all/breakfast', getAllRecipesHandler(BK)); // Public route
router.get('/breakfast/user', auth, getSpecificUserRecipeHandler(BK)); // FIXED: Added auth
router.get('/breakfast/:id', getSingleRecipeHandler(BK)); // Public route
router.put('/breakfast/:id', auth, upload.single('image'), updateRecipeHandler(BK)); // FIXED: Added auth
router.delete('/breakfast/:id', auth, deleteRecipeHandler(BK)); // FIXED: Added auth

// LUNCH ROUTES - FIXED: Added auth middleware where needed
router.post('/add/lunch', auth, upload.single('image'), createRecipeHandler(LN));
router.get('/all/lunch', getAllRecipesHandler(LN)); // Public route
router.get('/lunch/user', auth, getSpecificUserRecipeHandler(LN)); // FIXED: Added auth
router.get('/lunch/:id', getSingleRecipeHandler(LN)); // Public route
router.put('/lunch/:id', auth, upload.single('image'), updateRecipeHandler(LN)); // FIXED: Added auth
router.delete('/lunch/:id', auth, deleteRecipeHandler(LN)); // FIXED: Added auth

// SNACKS ROUTES - FIXED: Added auth middleware where needed
router.post('/add/snacks', auth, upload.single('image'), createRecipeHandler(SN));
router.get('/all/snacks', getAllRecipesHandler(SN)); // Public route
router.get('/snacks/user', auth, getSpecificUserRecipeHandler(SN)); // FIXED: Added auth
router.get('/snacks/:id', getSingleRecipeHandler(SN)); // Public route
router.put('/snacks/:id', auth, upload.single('image'), updateRecipeHandler(SN)); // FIXED: Added auth
router.delete('/snacks/:id', auth, deleteRecipeHandler(SN)); // FIXED: Added auth

// DINNER ROUTES - FIXED: Added auth middleware where needed
router.post('/add/dinner', auth, upload.single('image'), createRecipeHandler(DN));
router.get('/all/dinner', getAllRecipesHandler(DN)); // Public route
router.get('/dinner/user', auth, getSpecificUserRecipeHandler(DN)); // FIXED: Added auth
router.get('/dinner/:id', getSingleRecipeHandler(DN)); // Public route
router.put('/dinner/:id', auth, upload.single('image'), updateRecipeHandler(DN)); // FIXED: Added auth
router.delete('/dinner/:id', auth, deleteRecipeHandler(DN)); // FIXED: Added auth

module.exports = router;
