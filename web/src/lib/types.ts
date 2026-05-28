export interface Season {
    year: number;
    totalPitTime: number;
}

export interface Race {
    id: number;
    officialName: string;
    round: number;
    totalPitTime: number;
}

export interface DriverPitStop {
    driverId: string;
    constructorId: string;
    totalPitTime: number;
    stopCount: number;
}

