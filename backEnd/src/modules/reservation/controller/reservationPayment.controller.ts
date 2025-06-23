import { Request, Response } from "express";
import { ReservationPaymentModel } from "../data/dtos/reservationPayment.dto";
import {
  createReservationPaymentService,
  updateReservationPaymentService,
  deleteReservationPaymentService,
  getReservationPaymentByIdService,
  getAllReservationPaymentsService,
  getReservationPaymentsByReservationService,
  getReservationPaymentsByCustomerService,
  getReservationPaymentsByParkingAreaService,
  getReservationPaymentsByParkingSlotService,
  getReservationPaymentsByPaymentStatusService,
  getReservationPaymentsByPaymentMethodService,
  getReservationPaymentsByDateRangeService,
  getReservationPaymentByReferenceNumberService,
  getReservationPaymentsByPaidByService,
  getReservationPaymentsByAmountRangeService,
  getSuccessfulPaymentsService,
  getFailedPaymentsService,
  getPendingPaymentsService,
  getRefundedPaymentsService
} from "../service/reservationPayment.service";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/reservationPayment");
  },
  filename: (req, file, cb) => {
    cb(null, `RP-${uuidv4()}${ path.extname(file.originalname)}`);
  }
});

const upload = multer({  storage: storage });

export const createReservationPaymentHandler = [upload.array("images", 10), async (req: Request, res: Response) => {
  try {
    const paymentData = req.body as Omit<ReservationPaymentModel, "isDeleted">;
    const paymentImages = req.files as Express.Multer.File[];
    if(paymentImages && paymentImages.length > 0){
      const paymentImagesUrls = paymentImages.map((image) => `/reservationPayment/${image.filename}`);
      paymentData.images = paymentImagesUrls as Array<string> ;
    }
    const payment = await createReservationPaymentService(paymentData);
    res.status(201).json({
      success: true,
      data: payment,
      message: "Reservation payment created successfully"
    });
  } catch (error: unknown) {
    console.log(error,"error--------------------------------");
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
        console.log(error,"error--------------------------------");
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
}];

export const updateReservationPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentData = req.body as Partial<ReservationPaymentModel>;
    const payment = await updateReservationPaymentService(id, paymentData);
    res.status(200).json({
      success: true,
      data: payment,
      message: "Reservation payment updated successfully"
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const deleteReservationPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteReservationPaymentService(id);
    res.status(200).json({ 
      success: true,
      message: "Reservation payment deleted successfully" 
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const payment = await getReservationPaymentByIdService(id);
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Reservation payment not found" 
      });
    }
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getAllReservationPaymentsHandler = async (req: Request, res: Response) => {
  try {
    const { 
      startDate, 
      endDate, 
      parkingArea, 
      paymentStatus, 
      paymentMethod,
      customer,
      paidBy,
      minAmount,
      maxAmount
    } = req.query;

    let payments;

    // Apply filters based on query parameters
    if (startDate && endDate) {
      // Filter by date range
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      payments = await getReservationPaymentsByDateRangeService(start, end);
    } else if (parkingArea) {
      // Filter by parking area
      payments = await getReservationPaymentsByParkingAreaService(parkingArea as string);
    } else if (paymentStatus) {
      // Filter by payment status
      payments = await getReservationPaymentsByPaymentStatusService(paymentStatus as string);
    } else if (paymentMethod) {
      // Filter by payment method
      payments = await getReservationPaymentsByPaymentMethodService(paymentMethod as string);
    } else if (customer) {
      // Filter by customer
      payments = await getReservationPaymentsByCustomerService(customer as string);
    } else if (paidBy) {
      // Filter by paid by
      payments = await getReservationPaymentsByPaidByService(paidBy as string);
    } else if (minAmount && maxAmount) {
      // Filter by amount range
      payments = await getReservationPaymentsByAmountRangeService(
        parseFloat(minAmount as string), 
        parseFloat(maxAmount as string)
      );
    } else {
      // Get all payments
      payments = await getAllReservationPaymentsService();
    }

    // Apply additional filters if multiple filters are provided
    if (payments && payments.length > 0) {
      if (parkingArea && !startDate && !endDate && !paymentStatus && !paymentMethod && !customer && !paidBy && !minAmount) {
        // Already filtered by parking area
      } else if (parkingArea) {
        payments = payments.filter(p => p.parkingArea?.toString() === parkingArea);
      }

      if (paymentStatus && !startDate && !endDate && !parkingArea && !paymentMethod && !customer && !paidBy && !minAmount) {
        // Already filtered by payment status
      } else if (paymentStatus) {
        payments = payments.filter(p => p.paymentStatus === paymentStatus);
      }

      if (paymentMethod && !startDate && !endDate && !parkingArea && !paymentStatus && !customer && !paidBy && !minAmount) {
        // Already filtered by payment method
      } else if (paymentMethod) {
        payments = payments.filter(p => p.paymentMethod === paymentMethod);
      }

      if (customer && !startDate && !endDate && !parkingArea && !paymentStatus && !paymentMethod && !paidBy && !minAmount) {
        // Already filtered by customer
      } else if (customer) {
        payments = payments.filter(p => p.customer?.toString() === customer);
      }

      if (paidBy && !startDate && !endDate && !parkingArea && !paymentStatus && !paymentMethod && !customer && !minAmount) {
        // Already filtered by paid by
      } else if (paidBy) {
        payments = payments.filter(p => p.paidBy?.toString() === paidBy);
      }
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByReservationHandler = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;
    const payments = await getReservationPaymentsByReservationService(reservationId);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByCustomerHandler = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const payments = await getReservationPaymentsByCustomerService(customerId);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByParkingAreaHandler = async (req: Request, res: Response) => {
  try {
    const { parkingAreaId } = req.params;
    const payments = await getReservationPaymentsByParkingAreaService(parkingAreaId);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByParkingSlotHandler = async (req: Request, res: Response) => {
  try {
    const { parkingSlotId } = req.params;
    const payments = await getReservationPaymentsByParkingSlotService(parkingSlotId);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByPaymentStatusHandler = async (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.params;
    const payments = await getReservationPaymentsByPaymentStatusService(paymentStatus);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByPaymentMethodHandler = async (req: Request, res: Response) => {
  try {
    const { paymentMethod } = req.params;
    const payments = await getReservationPaymentsByPaymentMethodService(paymentMethod);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByDateRangeHandler = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: "Start date and end date are required" 
      });
    }
    const payments = await getReservationPaymentsByDateRangeService(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentByReferenceNumberHandler = async (req: Request, res: Response) => {
  try {
    const { referenceNumber } = req.params;
    const payment = await getReservationPaymentByReferenceNumberService(referenceNumber);
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Reservation payment not found" 
      });
    }
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByPaidByHandler = async (req: Request, res: Response) => {
  try {
    const { paidById } = req.params;
    const payments = await getReservationPaymentsByPaidByService(paidById);
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getReservationPaymentsByAmountRangeHandler = async (req: Request, res: Response) => {
  try {
    const { minAmount, maxAmount } = req.params;
    const payments = await getReservationPaymentsByAmountRangeService(
      parseFloat(minAmount),
      parseFloat(maxAmount)
    );
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getSuccessfulPaymentsHandler = async (req: Request, res: Response) => {
  try {
    const payments = await getSuccessfulPaymentsService();
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getFailedPaymentsHandler = async (req: Request, res: Response) => {
  try {
    const payments = await getFailedPaymentsService();
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getPendingPaymentsHandler = async (req: Request, res: Response) => {
  try {
    const payments = await getPendingPaymentsService();
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
};

export const getRefundedPaymentsHandler = async (req: Request, res: Response) => {
  try {
    const payments = await getRefundedPaymentsService();
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "An unknown error occurred" 
      });
    }
  }
}; 