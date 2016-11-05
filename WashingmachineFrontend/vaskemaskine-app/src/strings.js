var strings = {
    frontpageTitle: 'Nordre Ringgade 108 vaskerumbooking',
    createBookingModal: {
        title: 'Opret reservation',
        body: 'todo',
        save: 'Opret',
        cancel: 'Annuller',
        startTime: 'Starttidspunkt',
        endTime: 'Sluttidspunkt',
        numberOfWashes: 'Antal vaskninger (4 kr)',
        numberOfTumbleDries: 'Antal tørretumblinger (3 kr)',
        errorsMessages: {
            mustEndBefore22: 'Reservationen skal slutte senest kl. 22.00',
            mustReserveAtLeast30Minutes: 'Du skal mindst reservere en halv time',
            mustReserveEitherTumbleDrierOrWashingMachine: 'Du skal bestille mindst ét brug af vaskemaskine eller tørretumbler',
            dayIsBeforeToday: 'Du kan ikke reservere bagud i tiden',
            bookingIsClashing: 'Der ligger allerede en reservation i tidsrummet'
        }
    }
};

export default strings;