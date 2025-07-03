export interface CreateUpdateParkingSlotRequest {
    id?: String;
    parkingAreaId: string;
    slotNumber: number;
    slotType: string;
    slotPrice: number;
    slotDescription: string;
    slotImage: string;
    slotHeight: number;
    slotWidth: number;
    isActive: boolean;
    isDeleted: boolean;
    isReservationPending: boolean;
    isReserved: boolean;
    reservedVehicleNumber: string;
    reservationId: string;
    isBooked: boolean;
    addReservationId: string;
    removeReservationId: string;
    
  }
  
  export interface ParkingSlotListRequest {
    parkingAreaId?:string;
    search?: string;
    skip?: number;
    limit?: number;
  }