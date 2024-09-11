const { config } = require('../../config/config')



const calculateFare = (distanceInKm, estimatedTimeInMinutes, trafficConditions) => {

   
    const baseFare = parseFloat(config.BASE_FARE);
    const distanceFare = parseFloat(config.FARE_PER_KM) * distanceInKm;
    const timeFare = parseFloat(config.FARE_PER_MIN) * estimatedTimeInMinutes;
    const trafficMultiplier = parseFloat(config.TRAFFIC_MULTIPLIERS[trafficConditions]) || 1.0;

  
    let totalFare = (baseFare + distanceFare + timeFare) * trafficMultiplier;
  
    console.log('Total Fare before min check:', totalFare);

    totalFare = Math.max(totalFare, config.MINIMUM_FARE);
  
    return totalFare;
  };

  


module.exports = {
    calculateFare,
}