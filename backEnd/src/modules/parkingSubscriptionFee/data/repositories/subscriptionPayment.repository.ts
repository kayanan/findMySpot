import { SubscriptionPaymentDTO, SubscriptionPaymentModel } from "../dtos/subscriptionPayment.dto";

export const createSubscriptionPayment = async (subscriptionPayment: SubscriptionPaymentModel) => {
    const newSubscriptionPayment = await SubscriptionPaymentDTO.create(subscriptionPayment);
    return newSubscriptionPayment;
};


export const getSubscriptionPayments = async () => {
    const subscriptionPayments = await SubscriptionPaymentDTO.find();
    return subscriptionPayments;
};

export const getSubscriptionPaymentById = async (id: string) => {
    const subscriptionPayment = await SubscriptionPaymentDTO.findById(id);
    return subscriptionPayment;
};

export const updateSubscriptionPayment = async (id: string, subscriptionPayment: SubscriptionPaymentModel) => {
    const updatedSubscriptionPayment = await SubscriptionPaymentDTO.findByIdAndUpdate(id, subscriptionPayment, { new: true });
    return updatedSubscriptionPayment;
};

export const softDeleteSubscriptionPayment = async (id: string) => {
    const deletedSubscriptionPayment = await SubscriptionPaymentDTO.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return deletedSubscriptionPayment;
};

export const deleteSubscriptionPayment = async (id: string) => {
    const deletedSubscriptionPayment = await SubscriptionPaymentDTO.findByIdAndDelete(id);
    return deletedSubscriptionPayment;
};



