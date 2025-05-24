import { Request, Response } from "express";
import { createSubscriptionPaymentService, getSubscriptionPaymentsService, getSubscriptionPaymentByIdService, updateSubscriptionPaymentService, softDeleteSubscriptionPaymentService, deleteSubscriptionPaymentService ,generateHashService, notifyPaymentService} from "../service/subscriptionPayment.service";


export const createSubscriptionPaymentController = async (req: Request, res: Response) => {
    try{
        const subscriptionPayment = req.body;
        const newSubscriptionPayment = await createSubscriptionPaymentService(subscriptionPayment);
        res.status(201).json(newSubscriptionPayment);
    }catch(error){
        res.status(500).send(error);
    }
};

export const getSubscriptionPaymentsController = async (req: Request, res: Response) => {
    try{
        const subscriptionPayments = await getSubscriptionPaymentsService();
        res.status(200).json(subscriptionPayments);
    }catch(error){
        res.status(500).send(error);
    }
};

export const getSubscriptionPaymentByIdController = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const subscriptionPayment = await getSubscriptionPaymentByIdService(id);
        res.status(200).json(subscriptionPayment);
    }catch(error){
        res.status(500).send(error);
    }
};

export const updateSubscriptionPaymentController = async (req: Request, res: Response) => {
    try{    
    const { id } = req.params;
    const subscriptionPayment = req.body;
    const updatedSubscriptionPayment = await updateSubscriptionPaymentService(id, subscriptionPayment);
    res.status(200).json(updatedSubscriptionPayment);
    }catch(error){
        res.status(500).send(error);
    }
};

export const softDeleteSubscriptionPaymentController = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const deletedSubscriptionPayment = await softDeleteSubscriptionPaymentService(id);
        res.status(200).json(deletedSubscriptionPayment);
    }catch(error){
        res.status(500).send(error);
    }
};

export const deleteSubscriptionPaymentController = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const deletedSubscriptionPayment = await deleteSubscriptionPaymentService(id);
        res.status(200).json(deletedSubscriptionPayment);
    }catch(error){
        res.status(500).send(error);
    }
};

export const generateHashController = async (req: Request, res: Response) => {
    try{    
        const hash = await generateHashService(req.body);
        res.status(200).json(hash);
    }catch(error){
        res.status(500).send(error);
    }
};

export const notifyPaymentController = async (req: Request, res: Response) => {
    try{
        console.log(req.body,"--------------------------------req.body--------------------------------");
    const notifyPayment = await notifyPaymentService(req.body);
    if(notifyPayment.success){  
        res.status(200).json({message:"Payment successful"});
    }else{
        res.status(400).json({message:"Payment verification failed"});
    }
    }catch(error){
        console.log(error,"--------------------------------error--------------------------------");
        res.status(500).send(error);
    }
};