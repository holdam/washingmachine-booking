var strings = {
    frontpageTitle: 'Vaskerumsbooking',
    createBookingModal: {
        titleCreate: 'Opret reservation',
        titleEdit: 'Rediger reservation',
        body: 'todo',
        save: 'Opret',
        delete: 'Slet reservation',
        confirmEdit: 'Gem redigering',
        cancel: 'Annuller',
        startTime: 'Starttidspunkt',
        endTime: 'Sluttidspunkt',
        numberOfWashes: 'Antal vaskninger (4 kr)',
        numberOfTumbleDries: 'Antal tørretumblinger (3 kr)',
        confirmDeletion: 'Er du sikker på du vil slette reservationen?',
        errorsMessages: {
            mustEndBefore22: 'Reservationen skal slutte senest kl. 22.00',
            mustReserveAtLeast30Minutes: 'Du skal mindst reservere en halv time',
            mustReserveEitherTumbleDrierOrWashingMachine: 'Du skal bestille mindst ét brug af vaskemaskine eller tørretumbler',
            dayIsBeforeToday: 'Du kan ikke reservere bagud i tiden',
            bookingIsClashing: 'Der ligger allerede en reservation i tidsrummet',
            mustBeLoggedIn: 'Du skal være logget ind for at oprette en reservation'
        }
    },
    login: {
        username: 'Brugernavn',
        password: 'Kodeord',
        login: 'Log ind',
        logout: 'Log ud',
        loginFailed: 'Login mislykkedes',
        createUser: 'Opret bruger',
        welcome: 'Hej',
        createUserModal: {
            errorsMessages: {
                passwordCantBeEmpty: 'Dit password kan ikke være tomt',
                usernameCantBeEmpty: 'Dit brugernavn kan ikke være tomt',
                usernameTaken: 'Dit brugernavn er allerede taget'
            }
        }
    },
    misc: {
        globalErrorMessages: {
            error: 'Fejl!'
        }
    }
};

export default strings;