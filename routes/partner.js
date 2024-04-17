const Router = require("express");
const router = Router();
const partnerController = require("../controllers/partnerController");
const authMiddleware = require("../middleware/authMiddleware");
const {
    validateNewPartner, 
    validateUpdatePartner, 
    validateDeletePartner } = require("../middleware/validator/partnerValidator");

/**
 * @swagger
 * tags:
 *  - name: Partners
 *    description: Operations related to partners  
 */

/**
 * @swagger
 * /api/partners:
 *  get:
 *    summary: Get all partners
 *    description: Returns a list of all available partners.
 *    tags: [Partners]
 *    responses:
 *      200:
 *        description: A list of partners is returned.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Partner'
 *      400:
 *        description: No partners found
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *      500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"               
 */

router.get("/partners", partnerController.getAllPartners);

/**
 * @swagger
 * /api/partners/{id}:
 *  get:
 *    summary: Get a specific partner by id
 *    tags: [Partners]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: integer
 *    responses:
 *      200:
 *        description: The requested partner is returned.
 *        content:
 *          application/json:
 *            schema:
 *                - $ref: '#/components/schemas/Partner'
 *      404:
 *        description: Partner not found
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *      500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */

router.get("/partners/:partnerId", partnerController.getPartnerById);

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Add new partner to the database
 *     tags: [Partners]
 *     requestHeader:
 *       required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               - $ref: "#/components/schemas/PartnerInput"
 *     responses:
 *       201:
 *         description: Successfully created a new partner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 *       500:
 *          description: "Couldn't create new partner in DB"
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerError'
 */

router.post("/partners", validateNewPartner, authMiddleware, partnerController.createPartner);

/**
 * @swagger
 * /api/partners/{partnerId}:
 *   put:
 *     summary: Update existing partner information
 *     tags: [Partners]
 *     requestHeader:
 *       required: true
 *     parameters:
 *       - name: partnerId
 *         in: path
 *         require: true
 *         type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               - $ref: "#/components/schemas/PartnerInput"
 *     responses:
 *       200:
 *         description: Partner has been updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                 - $ref: '#/components/schemas/Partner'
 *       403:
 *         description: Not authorized to edit this partner
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/ClientError'
 *       404:
 *         description: No partner with provided id found
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Couldn't update the partner, please try again later
 *         content:
 *           application/json:
 *           schema:
 *              $ref: '#/components/schemas/ServerError'
 */        

router.put("/partners/:partnerId", validateUpdatePartner, authMiddleware, partnerController.updatePartner);

/**
 * @swagger
 * /api/partners/{partnerId}:
 *   delete:
 *     summary: Delete a partner by its ID
 *     tags: [Partners]
 *     requestHeader:
 *       require: true
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of partner to delete
 *     responses:
 *     204:
 *       description: Partner has been deleted successfully
 *     403:
 *       description: User not authorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     404:
 *       description: No partner with provided id
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error deleting the partner, please try again later
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.delete("/partners/:partnerId", validateDeletePartner, authMiddleware, partnerController.deletePartner);

module.exports = router;

