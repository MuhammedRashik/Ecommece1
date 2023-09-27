// Create a new review for a product
router.post('/products/:productId/reviews', authMiddleware, async (req, res) => {
    try {
        const productId = req.params.productId;
        const { star, reviewText } = req.body;

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create a new review object
        const review = {
            star,
            review: reviewText,
            postedBy: req.user._id, // Assuming you have user authentication in place
        };

        // Add the review to the product's ratings
        product.rating.individualRatings.push(review);

        // Recalculate the average rating and update the total ratings count
        const totalRatings = product.rating.individualRatings.length;
        const totalStars = product.rating.individualRatings.reduce((sum, r) => sum + r.star, 0);
        product.rating.average = totalStars / totalRatings;
        product.rating.totalRatings = totalRatings;

        // Save the updated product
        await product.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Retrieve all reviews for a product
router.get('/products/:productId/reviews', async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the product by ID and populate the postedBy field with user data
        const product = await Product.findById(productId)
            .populate('rating.individualRatings.postedBy', 'username');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ reviews: product.rating.individualRatings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});