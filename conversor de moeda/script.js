$(document).ready(()=>{

    let currenciesObject;
    let selectedCurrency;

    $.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL', function(data){
        currenciesObject = data;

        Object.keys(currenciesObject).forEach(currency => {
            $('#quotation-menu').append(`
                <option class="quotation" value='${currency}'>${currency}</option>`
            );
        });

    });

    $('#quotation-menu').on('change', function(){
        selectedCurrency = currenciesObject[$('#quotation-menu').val()];
        let obtainedDate = new Date(selectedCurrency.create_date);
        obtainedDate = obtainedDate.toLocaleString();
        $('#quotation-info').html(
            `<li>Cotação em  ${obtainedDate}: ${selectedCurrency.ask}</li>
            <li>Valor mínimo: ${selectedCurrency.low}</li>
            <li>Valor máximo: ${selectedCurrency.high}</li>`
        );
        let currentDate = new Date(Date.now());
        let lastWeek = new Date(Date.parse(currentDate)-(1000*60*60*24*7)); 
        let currentDateString = (currentDate.toISOString().slice(0,10));
        let lastWeekString = (lastWeek.toISOString().slice(0,10));

        $('#past-quotations').prepend(`
            <p>Para exibir as cotações diárias de um determinado período, selecione a 
                data de início e término desejados, e clique em "Obter histórico".
            </p>
            <label for="start-date">Início:</label>
            <input type="date" name="start-date" id="start-date" value=${lastWeekString} max=${currentDateString}>
            <label for="end-date">Término:</label>
            <input type="date" name="end-date" id="end-date" value=${currentDateString} max=${currentDateString}>
            <button id="get-period-quotation">Obter histórico</button>
        `);

        $('#get-period-quotation').click(function(){
            let startDate = $('#start-date').val();
            let endDate = $('#end-date').val();
            let startDateAsNumber = Date.parse(startDate);
            let endDateAsNumber = Date.parse(endDate);
            let intervalDays = (endDateAsNumber-startDateAsNumber)/(1000*60*60*24);
            startDate = startDate.replace(/-/g,'');
            endDate = endDate.replace(/-/g,'');
            $.get(`https://economia.awesomeapi.com.br/${selectedCurrency.code}-${selectedCurrency.codein}/${intervalDays}?start_date=${startDate}&end_date=${endDate}`, function(data){
                $('#past-quotations-list').html(`
                    <li> Cotação mais alta do período: ${data[0].high}</li>
                    <li> Cotação mais baixa do período: ${data[0].low}</li>
                `)
                let dateCount = startDateAsNumber;
                data.forEach(element => {
                    dateCount += 1000*60*60*24;
                    elementDate = new Date(dateCount);
                    $('#past-quotations-list').append(`
                        <li>Cotação em ${elementDate.toLocaleDateString()}: ${element.bid}</li>
                    `)
                });              
            });           
        });

    });

})