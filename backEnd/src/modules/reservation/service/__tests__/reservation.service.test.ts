import * as repo from '../../data/repositories/reservation.repository';
import * as validator from '../../validators/reservation.validator';
import * as parkingSlotService from '../../../parkingArea/service/parkingSlot.service';
import * as vehicleService from '../../../parkingSubscriptionFee/service/vehicle.service';
import * as reservationService from '../reservation.service';
import dayjs from 'dayjs';

describe('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservationService', () => {
    it('should create reservation if valid', async () => {
      jest.spyOn(validator.ReservationValidator, 'createReservationValidator').mockReturnValue({ data: { foo: 'bar' }, error: undefined } as any);
      jest.spyOn(repo, 'createReservation').mockResolvedValue({ _id: 'id1' } as any);
      const data = { parkingSlot: 'slot1', parkingArea: 'area1', user: 'user1', type: 'pre_booking', vehicleNumber: 'AB1234', customerMobile: '0771234567', perHourRate: 100, vehicleType: 'veh1', status: 'pending', paymentIds: [], paymentStatus: 'pending', paymentType: 'cash', createdBy: 'user1', startDateAndTime: new Date(), advanceAmount: 0, totalAmount: 0, isDeleted: false };
      const result = await reservationService.createReservationService(data as any);
      expect(result).toEqual({ _id: 'id1' });
    });
    it('should throw if validation fails', async () => {
      jest.spyOn(validator.ReservationValidator, 'createReservationValidator').mockReturnValue({ error: { message: 'Validation error' } } as any);
      await expect(reservationService.createReservationService({} as any)).rejects.toThrow('Validation error');
    });
  });

  describe('updateReservationService', () => {
    it('should update reservation if valid', async () => {
      jest.spyOn(validator.ReservationValidator, 'updateReservationValidator').mockReturnValue({ data: { foo: 'bar' }, error: undefined } as any);
      jest.spyOn(repo, 'updateReservation').mockResolvedValue({ _id: 'id1' } as any);
      const result = await reservationService.updateReservationService('id1', { foo: 'bar' } as any);
      expect(result).toEqual({ _id: 'id1' });
    });
    it('should throw if validation fails', async () => {
      jest.spyOn(validator.ReservationValidator, 'updateReservationValidator').mockReturnValue({ error: { message: 'Validation error' } } as any);
      await expect(reservationService.updateReservationService('id1', {} as any)).rejects.toThrow('Validation error');
    });
  });

  describe('deleteReservationService', () => {
    it('should delete reservation', async () => {
      jest.spyOn(repo, 'deleteReservation').mockResolvedValue({ _id: 'id1' } as any);
      const result = await reservationService.deleteReservationService('id1');
      expect(result).toEqual({ _id: 'id1' });
    });
  });

  describe('getReservationByIdService', () => {
    it('should get reservation by id', async () => {
      jest.spyOn(repo, 'findReservationById').mockResolvedValue({ _id: 'id1' } as any);
      const result = await reservationService.getReservationByIdService('id1');
      expect(result).toEqual({ _id: 'id1' });
    });
  });

  describe('getAllReservationsService', () => {
    it('should get all reservations', async () => {
      jest.spyOn(repo, 'findAllReservations').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getAllReservationsService();
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationsByUserService', () => {
    it('should get reservations by user', async () => {
      jest.spyOn(repo, 'findReservationsByUser').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByUserService('user1');
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationsByParkingAreaService', () => {
    it('should get reservations by parking area', async () => {
      jest.spyOn(repo, 'findReservationsByParkingArea').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByParkingAreaService('area1');
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationsByParkingSlotService', () => {
    it('should get reservations by parking slot', async () => {
      jest.spyOn(repo, 'findReservationsByParkingSlot').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByParkingSlotService('slot1');
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getActiveReservationsService', () => {
    it('should get active reservations', async () => {
      jest.spyOn(repo, 'findActiveReservations').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getActiveReservationsService();
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationsByStatusService', () => {
    it('should get reservations by status', async () => {
      jest.spyOn(repo, 'findReservationsByStatus').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByStatusService('pending');
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationsByPaymentStatusService', () => {
    it('should get reservations by payment status', async () => {
      jest.spyOn(repo, 'findReservationsByPaymentStatus').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByPaymentStatusService('pending');
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationByVehicleNumberService', () => {
    it('should get reservation by vehicle number', async () => {
      jest.spyOn(repo, 'findReservationByVehicleNumber').mockResolvedValue({ _id: 'id1' } as any);
      const result = await reservationService.getReservationByVehicleNumberService('ABC1234');
      expect(result).toEqual({ _id: 'id1' });
    });
  });

  describe('getReservationsByDateRangeService', () => {
    it('should get reservations by date range', async () => {
      jest.spyOn(repo, 'findReservationsByDateRange').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByDateRangeService(new Date(), new Date());
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('getReservationsByMobileNumberService', () => {
    it('should get reservations by mobile number', async () => {
      jest.spyOn(repo, 'findReservationsByMobileNumber').mockResolvedValue([{ _id: 'id1' }] as any);
      const result = await reservationService.getReservationsByMobileNumberService('0771234567');
      expect(result).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('completeReservationService', () => {
    it('should complete reservation and calculate totalAmount', async () => {
      jest.spyOn(repo, 'findReservationById').mockResolvedValue({ _id: 'id1', startDateAndTime: new Date(Date.now() - 2 * 60 * 60 * 1000), perHourRate: 100 } as any);
      jest.spyOn(repo, 'updateReservation').mockResolvedValue({ _id: 'id1', totalAmount: 200 } as any);
      const result = await reservationService.completeReservationService('id1');
      expect(result).toEqual({ _id: 'id1', totalAmount: 200 });
    });
    it('should throw if reservation not found', async () => {
      jest.spyOn(repo, 'findReservationById').mockResolvedValue(null as any);
      await expect(reservationService.completeReservationService('id1')).rejects.toThrow('Reservation not found');
    });
  });

  describe('cancelReservationService', () => {
    it('should cancel reservation', async () => {
      jest.spyOn(repo, 'updateReservation').mockResolvedValue({ _id: 'id1', status: 'cancelled' } as any);
      const result = await reservationService.cancelReservationService('id1');
      expect(result).toEqual({ _id: 'id1', status: 'cancelled' });
    });
  });

  describe('updatePaymentStatusService', () => {
    it('should update payment status', async () => {
      jest.spyOn(repo, 'updateReservation').mockResolvedValue({ _id: 'id1', paymentStatus: 'paid' } as any);
      const result = await reservationService.updatePaymentStatusService('id1', 'paid');
      expect(result).toEqual({ _id: 'id1', paymentStatus: 'paid' });
    });
  });

  describe('createPreBookingReservationService', () => {
    const validObjectId = '507f1f77bcf86cd799439011';
    it('should create pre-booking reservation and update slot', async () => {
      jest.spyOn(vehicleService, 'getVehicleByVehicleType').mockResolvedValue({ _id: 'veh1' } as any);
      jest.spyOn(parkingSlotService, 'filterParkingSlots').mockResolvedValue([{ slotCount: 1, slots: ['slot1'] }] as any);
      jest.spyOn(repo, 'createReservation').mockResolvedValue({ _id: 'res1' } as any);
      jest.spyOn(parkingSlotService, 'updateSlot').mockResolvedValue({} as any);
      const data = { vehicleType: 'car', startDateAndTime: new Date(), parkingArea: validObjectId, vehicleNumber: 'ABC1234' };
      const result = await reservationService.createPreBookingReservationService(data as any);
      expect(result).toEqual({ _id: 'res1' });
    });
    it('should throw if no parking slots found', async () => {
      jest.spyOn(vehicleService, 'getVehicleByVehicleType').mockResolvedValue({ _id: 'veh1' } as any);
      jest.spyOn(parkingSlotService, 'filterParkingSlots').mockResolvedValue([] as any);
      const data = { vehicleType: 'car', startDateAndTime: new Date(), parkingArea: validObjectId, vehicleNumber: 'ABC1234' };
      await expect(reservationService.createPreBookingReservationService(data as any)).rejects.toThrow('No parking slots found');
    });
    it('should throw if no parking slots available', async () => {
      jest.spyOn(vehicleService, 'getVehicleByVehicleType').mockResolvedValue({ _id: 'veh1' } as any);
      jest.spyOn(parkingSlotService, 'filterParkingSlots').mockResolvedValue([{ slotCount: 0, slots: [] }] as any);
      const data = { vehicleType: 'car', startDateAndTime: new Date(), parkingArea: validObjectId, vehicleNumber: 'ABC1234' };
      await expect(reservationService.createPreBookingReservationService(data as any)).rejects.toThrow('No parking slots available');
    });
  });
}); 