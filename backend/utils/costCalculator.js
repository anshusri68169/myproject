export const calculateOrderCost = (vehicleType, weight, distance = 5) => {
  const baseFares = {
    bike: 50,
    scooter: 75,
    auto: 100,
  };

  const baseFare = baseFares[vehicleType] || 50;
  const distanceFare = distance * 4; // ₹4 per km
  const weightSurcharge = Math.max(0, (weight - 2) * 5); // ₹5 per kg above 2kg
  const tax = Math.round((baseFare + distanceFare + weightSurcharge) * 0.05); // 5% tax

  const totalFare = baseFare + distanceFare + weightSurcharge + tax;

  return {
    baseFare,
    distanceFare,
    weightSurcharge,
    tax,
    totalFare,
  };
};

export const calculateCommission = (totalFare, commissionPercentage = 15) => {
  return Math.round((totalFare * commissionPercentage) / 100);
};

export const calculatePartnerEarnings = (totalFare, commissionPercentage = 15) => {
  const commission = calculateCommission(totalFare, commissionPercentage);
  const earnings = totalFare - commission;
  return {
    earnings,
    commission,
  };
};
