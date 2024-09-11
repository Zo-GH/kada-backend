const { config } = require('../../config/config')



const calculateFare = (distanceInKm, estimatedTimeInMinutes, trafficConditions) => {
    const baseFare = config.BASE_FARE;
    const distanceFare = config.FARE_PER_KM * distanceInKm;
    const timeFare = config.FARE_PER_MIN * estimatedTimeInMinutes;
  
    const trafficMultiplier = config.TRAFFIC_MULTIPLIERS[trafficConditions] || 1.0;
    console.log('baseFare...', baseFare)
    console.log('distanceFare...', distanceFare)
    console.log('timeFare...', timeFare)
    console.log('multiplier...', trafficMultiplier)
  
    let totalFare = (baseFare + distanceFare + timeFare) * trafficMultiplier;
  
    console.log('Total Fare before min check:', totalFare);

    totalFare = Math.max(totalFare, config.MINIMUM_FARE);
  
    return totalFare;
  };

  


module.exports = {
    calculateFare,
}