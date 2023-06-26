const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { ProductModel } = require("../model/product/product.model");
const { OrderModel } = require("../model/order.model");
const { PurchasesModel } = require("../model/purchases.model");
const moment = require("moment/moment");
const { RefundModel } = require("../model/refund.model");
const { ShrinkageModel } = require("../model/shrinkage.model");
const { SalesModel } = require("../model/sales.model");

const getRrecord = async (req, res) => {
    try {
        let invoicTotal = 0;
        let totalDue = 0;
        let { fromDate, toDate } = req.query;
        fromDate = fromDate == 'undefined' ? new Date() : fromDate;
        toDate = toDate == 'undefined' ? new Date() : toDate;
        var fromDateHandel = new Date(fromDate);
        var toDateHandel = new Date(toDate);
        fromDate = moment(fromDateHandel).startOf('day').toDate()
        toDate = moment(toDateHandel).endOf('day').toDate()

        let reportOptions = {
            filter: {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            },
            sort: {
                createdAt: -1,
            }
        }
        const { _id, role } = req.user
        const isAdmin = role == 'admin' ? true : false
        let pipeline = [];
        if (isAdmin) {
            pipeline = [];
        } else {
            pipeline = [
                {
                    $match: { user: _id }
                },
            ];
        }

        const sale = await SalesModel.aggregate([
             { $match: reportOptions.filter },
             { $sort: reportOptions.sort },
            ...pipeline,
            {
                $unwind: "$item"
            },
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: "$item.quantity"
                    },
                    total: { $sum: "$item.saleing_Price" },
                }
            },
            {
                $project: {
                    quantity: true,
                    total: true,
                    totalAmount: true
                }
            }
        ]);
        const purchases = await PurchasesModel.aggregate([
            ...pipeline,
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: '$quantity'
                    },
                    cost: {
                        $sum: { $multiply: ["$quantity", "$cost"] }
                    },

                }
            },
            {
                $project: {
                    quantity: true,
                    cost: true,
                }
            }
        ])



        let payment = await SalesModel.aggregate([

            ...pipeline,
            { $match: reportOptions.filter },
            { $sort: reportOptions.sort },
            {
                $group: {
                    _id: "$payment",
                    totalAmount: { $sum: "$totalPrice" },
                }
            }
        ],
        );


        for (const item of payment) {
            if (item._id !== 'due') {
                invoicTotal += item.totalAmount;
            } else {
                totalDue += item.totalAmount;
            }
        }
        payment = { totalInvoic: invoicTotal, totalDue: totalDue }





        const refund = await RefundModel.aggregate([
            { $match: reportOptions.filter },
            { $sort: reportOptions.sort },
            ...pipeline,
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: '$quantity'
                    },
                }
            },
            {
                $project: {
                    quantity: true,
                }
            }
        ]);
        const shrinkage = await ShrinkageModel.aggregate([
            { $match: reportOptions.filter },
            { $sort: reportOptions.sort },
            ...pipeline,
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: '$quantity'
                    },
                }
            },
            {
                $project: {
                    quantity: true,
                }
            }
        ]);




        return res.status(200).json({ purchases: purchases, sale: sale, payment: payment, refund: refund, shrinkage: shrinkage })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = { getRrecord }