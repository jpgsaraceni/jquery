// separar em duas classes. Uma que apenas receba os valores dos inputs 
// e outra que receba apenas o cep e preencha os campos automaticamente 
import key from './api-key.js';

function Address() {
    let postalCode;
    let addressObject;
    let state;
    let city;
    let street;
    let number;
    let complement;
    let stateElement;
    let cityElement;
    let streetElement;
    let numberElement;
    let mapElement;
    let awesomeApiAutocompleteFlag;

    function setPostalCode(_postalCode) { // validate
        postalCode = _postalCode;
        awesomeApi();

        function getPostalCode() {
            return postalCode;
        };

        function setState(_state) { // validate
            state = _state;
        };

        function getState() {
            return state;
        };

        function setCity(_city) { // validate
            city = _city;
        };

        function getCity() {
            return city;
        };

        function setStreet(_street) { // validate
            street = _street;
        };

        function getStreet() {
            return street;
        };

        function setNumber(_number) { // validate
            number = _number;
        };

        function getNumber() {
            return number;
        };

        function setComplement(_complement) { // validate
            complement = _complement;
        };

        function getComplement() {
            return complement;
        };

        function setStateElement(_stateElement) { // validate
            stateElement = _stateElement;
        };

        function setCityElement(_cityElement) { // validate
            cityElement = _cityElement;
        };

        function setStreetElement(_streetElement) { // validate
            streetElement = _streetElement;
        };

        function setNumberElement(_numberElement) { // validate
            numberElement = _numberElement;
        }

        function setMapElement(_mapElement) { // validate
            mapElement = _mapElement;
        };

        function callbackAwesomeApi(_data) {
            awesomeApiAutocompleteFlag = true;
            console.log(_data);
            state = _data.state;
            city = _data.city;
            street = _data.address;
            if (state) {
                stateElement.attr('value', state);
                stateElement.prop('disabled', true);
            };
            if (city) {
                cityElement.attr('value', city);
                cityElement.prop('disabled', true);
            };
            if (street) {
                streetElement.attr('value', street);
                streetElement.prop('disabled', true);
            };
            const fullAddress = street + city + state;
            const addressParameter = fullAddress.replace(/ /g, '+');
            mapElement.html(`
            <iframe id="address-map"
                src="https://www.google.com/maps/embed/v1/search?key=${key}&q=${addressParameter}&center=${_data.lat}%2C${_data.lng}&zoom=17" allowfullscreen>
            </iframe>`
            );
            numberElement.focus();
        };

        function callbackAwesomeApiFail() {
            console.log("awesome api fail");
            mapElement.html('');
            stateElement.prop('disabled', false);
            stateElement.focus();
            cityElement.prop('disabled', false);
            streetElement.prop('disabled', false);
            correiosApi();
            // usar API dos correios
        };

        function callbackViacep(_data) {
            console.log("viacep api");
            console.log(_data);
            state = _data.uf;
            city = _data.localidade;
            street = _data.logradouro;
            if (state) {
                stateElement.attr('value', state);
                stateElement.prop('disabled', true);
            } else {
                stateElement.focus();
            };
            if (city) {
                cityElement.attr('value', city);
                cityElement.prop('disabled', true);
            } else {
                cityElement.focus();
            };
            if (street) {
                streetElement.attr('value', street);
                streetElement.prop('disabled', true);
                numberElement.focus();
            } else {
                streetElement.focus();
            };
            const fullAddress = street + city + state;
            const addressParameter = fullAddress.replace(/ /g, '+');
            mapElement.html(`
            <iframe id="address-map"
                src="https://www.google.com/maps/embed/v1/search?key=${key}&q=${addressParameter}&zoom=13" allowfullscreen>
            </iframe>`
            );
        };

        function callbackViacepFail() {
            console.log("viacep fail");
        };

        function awesomeApi() {
            $.get(`https://cep.awesomeapi.com.br/json/${postalCode}`)
                .done((data) => {
                    callbackAwesomeApi(data);
                    return true;
                })
                .fail(() => {
                    callbackAwesomeApiFail();
                    return false;
                });
        };

        function correiosApi() {
            $.get(`https://viacep.com.br/ws/${postalCode}/json/`)
                .done((data) => {
                    callbackViacep(data);
                    return true;
                })
                .fail(() => {
                    callbackViacepFail();
                    return false;
                });
        };

        function getAwesomeApiAutocompleteFlag() {
            return awesomeApiAutocompleteFlag;
        };

        function updateMap() {
            let fullAddress;
            let zoom = 15;
            if (number) {
                fullAddress = number + street + city + state;
                zoom = 18;
            } else {
                fullAddress = street + city + state;
            };
            const addressParameter = fullAddress.replace(/ /g, '+');
            mapElement.html(`
            <iframe id="address-map"
                src="https://www.google.com/maps/embed/v1/search?key=${key}&q=${addressParameter}&zoom=${zoom}" allowfullscreen>
            </iframe>`
            );
        };

        return {
            setPostalCode,
            getPostalCode,
            setState,
            getState,
            setCity,
            getCity,
            setStreet,
            getStreet,
            setNumber,
            getNumber,
            setComplement,
            getComplement,
            setStateElement,
            setCityElement,
            setStreetElement,
            setNumberElement,
            setMapElement,
            getAwesomeApiAutocompleteFlag,
            updateMap,
        };
    };

    const addressPlotter = new Address();

    $(document).ready(() => {

        addressPlotter.setStateElement($('#state'));
        addressPlotter.setCityElement($('#city'));
        addressPlotter.setStreetElement($('#street'));
        addressPlotter.setNumberElement($('#number'));
        addressPlotter.setMapElement($('#map'));

        $('#postal-code').focus();


        $('#postal-code').blur(function (event) {
            if ($('#postal-code').val().length == 8 && (isNaN($('#postal-code').val()) == false)) {
                $('#postal-code-required').hide();
                addressPlotter.setPostalCode($('#postal-code').val());
            } else {
                $('#postal-code').focus();
                $('#postal-code-required').show();
            }
        });

        $('#street').blur(function (event) {
            if ($('#street').val()) {
                addressPlotter.setStreet($('#street').val());
                addressPlotter.updateMap();
            };
        });

        $('#number').blur(function (event) {
            if ($('#number').val()) {
                addressPlotter.setNumber($('#number').val());
                addressPlotter.updateMap();
            };
        });

        // usar $('elemento).mask("00.000-000")

        // $('#save').click(()=>{ 
        //     $('#required').hide();
        //     console.log($('.required-field').val())
        //     if($('.required-field').val() == 0){
        //         console.log("empty field")
        //         $('#required').show();
        //     };
        // });

    });