import { SubscriptionPaymentModel } from "../data/dtos/subscriptionPayment.dto";
import { createSubscriptionPayment, getSubscriptionPayments, getSubscriptionPaymentById, updateSubscriptionPayment, softDeleteSubscriptionPayment, deleteSubscriptionPayment } from "./../data/repositories/subscriptionPayment.repository"
import crypto from "crypto";
import md5 from "crypto-js/md5";

export const createSubscriptionPaymentService = async (subscriptionPayment: SubscriptionPaymentModel) => {
    const newSubscriptionPayment = await createSubscriptionPayment(subscriptionPayment);
    return newSubscriptionPayment;
};

export const getSubscriptionPaymentsService = async () => {
    const subscriptionPayments = await getSubscriptionPayments();
    return subscriptionPayments;
};

export const getSubscriptionPaymentByIdService = async (id: string) => {
    const subscriptionPayment = await getSubscriptionPaymentById(id);
    return subscriptionPayment;
};

export const updateSubscriptionPaymentService = async (id: string, subscriptionPayment: SubscriptionPaymentModel) => {
    const updatedSubscriptionPayment = await updateSubscriptionPayment(id, subscriptionPayment);
    return updatedSubscriptionPayment;
};

export const softDeleteSubscriptionPaymentService = async (id: string) => {
    const deletedSubscriptionPayment = await softDeleteSubscriptionPayment(id);
    return deletedSubscriptionPayment;
};

export const deleteSubscriptionPaymentService = async (id: string) => {
    const deletedSubscriptionPayment = await deleteSubscriptionPayment(id);
    return deletedSubscriptionPayment;
};

export const generateHashService = async (body: any) => {
    const { order_id, amount, currency } = body;
    const hashedMerchantSecret = crypto
    .createHash("md5")
    .update(process.env.MERCHANT_SECRET!)
    .digest("hex")
    .toString()
    .toUpperCase();
    const hash = crypto
    .createHash("md5")
    .update(
      process.env.MERCHANT_ID!.toString() +
        order_id +
        amount +
        currency +
        hashedMerchantSecret
    )
    .digest("hex")
    .toUpperCase();
    // let merchantSecret  = process.env.MERCHANT_SECRET!;
    // let merchantId      = process.env.MERCHANT_ID!;
    // let hashedSecret    = md5(merchantSecret).toString().toUpperCase();
    // let amountFormated  = parseFloat( amount ).toLocaleString( 'en-us', { minimumFractionDigits : 2 } ).replace(/,/g, '');
    // console.log(merchantId,order_id,amountFormated,currency,hashedSecret);
    // let hash            = md5(merchantId + order_id + amountFormated + currency + hashedSecret).toString().toUpperCase();
    return {hash,merchant_id:process.env.MERCHANT_ID};
};

export const notifyPaymentService = async (body: any) => {
    console.log(body,"--------------------------------body--------------------------------");
    const {
        merchant_id,
        order_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
      } = body;
      const local_md5sig = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          crypto
            .createHash("md5")
            .update(process.env.MERCHANT_SECRET!.toString())
            .digest("hex")
            .toUpperCase()
      )
      .digest("hex")
      .toUpperCase();
      if (local_md5sig === md5sig && status_code == "2") {
        console.log("Payment successful");
        // Payment success - update the database
        return {success:true,message:"Payment successful"};
      } else {
        console.log("Payment verification failed");
        // Payment verification failed
        return {success:false,message:"Payment verification failed"};
      }
};












