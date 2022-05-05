(function(w) {

    // create new object
    var core = function() {
        this.hotelData = [{
                id: 1,
                name: "Voyage Hotel 1",
                score: 7.4,
                img: "https://via.placeholder.com/125x125.png"
            },
            {
                id: 4,
                name: "Voyage Hotel 4",
                score: 5.7,
                img: "https://via.placeholder.com/125x125.png"
            },
            {
                id: 2,
                name: "Voyage Hotel 2",
                score: 6.9,
                img: "https://via.placeholder.com/125x125.png"
            },
            {
                id: 3,
                name: "Voyage Hotel 3",
                score: 1.0,
                img: "https://via.placeholder.com/125x125.png"
            },
        ];
        this.LS_HotelData = localStorage.getItem("LS_HotelData");
        this.inLocalStorageHotelDataState = this.LS_HotelData !== undefined && this.LS_HotelData !== null;
        this.inCoreHotelDataState = this.hotelData !== undefined && this.hotelData.length > 0;
        this.hotelScoreCalculateValues = {
            maxScore: 10,
            minScore: 0,
            plus: 1.0,
            minus: 1.0
        }
    };

    // constructor
    core.constructor = core;

    // add functions in prototype
    core.prototype = {
            init: async function() {
                $core.events()
                await $core.hotelDataPrepare().then(
                    () => { $core.bindViewHotelData() }
                )
            },

            events: function() {
                $('body').on('click', '[data-js="filter"]', function() {
                    $('.ets__add--filter ul').toggleClass('js-active')
                })

                $('body').on('click', '.ets__add--filter li a', function(e) {
                    e.preventDefault();
                    var hotels = $core.getHotelData();
                    var compilerHotelsData = $core.sortHotels(hotels, $(this).data("js"))
                    localStorage.setItem('LS_HotelData', JSON.stringify(compilerHotelsData));
                    $core.bindViewHotelData()
                    $('.ets__add--filter ul').removeClass('js-active');
                    $('[data-js="order-text"]').text(this.text);

                })

                $('body').on('click', '[data-js="ets__plus"]', function(e) {
                    var hotels = $core.getHotelData();
                    if (hotels.length > 0) {
                        if (Number(parseFloat($(this).data("score"))) < $core.hotelScoreCalculateValues.maxScore) {
                            var itemId = $(this).data("id")
                            var hotelsByItem = hotels.findIndex((hotel => hotel.id == itemId));
                            hotels[hotelsByItem].score = Number(parseFloat($(this).data("score") + $core.hotelScoreCalculateValues.plus).toString().substring(0, 3))
                            localStorage.setItem('LS_HotelData', JSON.stringify(hotels));
                            $core.bindViewHotelData()
                        } else {
                            console.log("zaten maxsimum azami score da ")
                        }
                    }
                })

                $('body').on('click', '[data-js="ets__minus"]', function(e) {
                    var hotels = $core.getHotelData();
                    if (hotels.length > 0) {
                        if (
                            Number(parseFloat($(this).data("score"))) > $core.hotelScoreCalculateValues.minScore
                        ) {
                            var itemId = $(this).data("id")
                            var hotelsByItem = hotels.findIndex((hotel => hotel.id == itemId));
                            hotels[hotelsByItem].score = Number(parseFloat($(this).data("score") - $core.hotelScoreCalculateValues.minus).toString().substring(0, 3))
                            localStorage.setItem('LS_HotelData', JSON.stringify(hotels));
                            $core.bindViewHotelData()
                        } else {
                            console.log("zaten minimum azami score da ")
                        }
                    }
                })

                $('body').on('click', '[data-js="ets__delete"]', function(e) {
                    $('[data-modal="modal"]').find('span').text($(this).data("name"))
                    $('[data-js="ets__delete--modal"]').attr("data-id", $(this).data("id"))
                    var html = $('[data-modal="modal"]').html();
                    $core.openModal(html, "Oteli Sİl")

                })

                $('body').on('click', '[data-js="ets__delete"]', function(e) {
                    $('[data-modal="modal"]').find('span').text($(this).data("name"))
                    $('[data-js="ets__delete--modal"]').attr("data-id", $(this).data("id"))
                    var html = $('[data-modal="modal"]').html();
                    $core.openModal(html, "Oteli Sİl")

                })

                $('body').on('click', '[data-js="ets__delete--modal"]', function(e) {
                    var hotels = $core.getHotelData();
                    if (hotels != null) {
                        var itemId = $(this).data("id")
                        for (var i = 0; hotels.length; i++) {
                            if (hotels[i].id == itemId) {
                                hotels.splice(i, 1);
                                break;
                            }
                        }
                        localStorage.setItem("products", JSON.stringify(hotels))
                        $core.bindViewHotelData();
                        $core.clearModal();
                    }
                })
            },

            sortHotels: function(hotels, sortType) {
                var sortedHotels;
                switch (sortType) {
                    case "plus":
                        sortedHotels = hotels.sort((a, b) => a.score - b.score)
                        break;
                    case "minus":
                        sortedHotels = hotels.sort((a, b) => b.score - a.score)
                        break;
                    default:
                        sortedHotels = hotels.sort((a, b) => b.score - a.score)
                        break;
                }
                return sortedHotels
            },

            getHotelData: function() {
                var hotels = !$core.inLocalStorageHotelDataState ? $core.hotelData : $core.inCoreHotelDataState ? $core.hotelData : [];
                return hotels;
            },

            hotelDataPrepare: async function() {
                if (this.inLocalStorageHotelDataState) {
                    this.hotelData.sort((a, b) => a.score - b.score)
                    localStorage.setItem('LS_HotelData', JSON.stringify(this.hotelData));
                }
            },

            bindViewHotelData: function() {
                $('.ets__product--list .row').html("")
                var hotels = $core.getHotelData();
                if (hotels && hotels.length) {
                    hotels.forEach(function(i) {
                        var html = "";
                        html += ' <div class="col-md-6">'
                        html += '     <div class="ets__item--area">'
                        html += '         <button class="ets__delete" data-js="ets__delete" data-name="' + i.name + '" data-id="' + i.id + '"><i class="icon-Close"></i></button>'
                        html += '         <div class="ets__img">'
                        html += '             <img src="https://via.placeholder.com/125x125.png" alt="">'
                        html += '         </div>'
                        html += '         <div class="ets__info--area">'
                        html += '             <h2>' + i.name + '</h2>'
                        html += '             <div class="ets__score--area">'
                        html += '                 <div class="ets__score">' + i.score + ' Puan</div>'
                        html += '                 <div class="ets__button-area">'
                        html += '                     <button class="btn ets__plus" data-id="' + i.id + '" data-score="' + i.score + '" data-js="ets__plus">PUAN ARTIR</button>'
                        html += '                     <button class="btn ets__minus" data-id="' + i.id + '" data-score="' + i.score + '"  data-js="ets__minus">PUAN AZALT</button>'
                        html += '                 </div>'
                        html += '             </div>'
                        html += '         </div>'
                        html += '     </div>'
                        html += ' </div>'

                        $('.ets__product--list .row').append(html)
                    })
                } else {
                    $('.ets__product--list .row').html("Veri Bulunamadı!")
                }
            },

            openModal: function(body, header, footer, width, noCenter, autoHeight) {
                var modalContent = $core.createModalContent(body, header, footer, width, noCenter, autoHeight);
                $('#site-modal').html(modalContent);
                $('#site-modal').modal('show');
            },

            createModalContent: function(body, header, footer, width, noCenter, autoHeight) {
                // width: 'modal-sm', 'modal-lg', 'modal-xl'
                var modalHeader = '',
                    modalBody = '',
                    modalFooter = '';
                var modalWidth = width == null ? 'modal-md' : width;
                var modalCenter = noCenter ? '' : 'modal-dialog-centered';
                var modalHeight = autoHeight ? 'auto-height' : '';
                var closeButton = '<button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                if (header) {
                    modalHeader = '<div class="modal-header"><h5 class="modal-title">' + header + '</h5></div>';
                }
                if (footer) {
                    modalFooter = '<div class="modal-footer">' + footer + '</div>';
                }
                if (body) {
                    modalBody = '<div class="modal-body">' + body + '</div>';
                }
                var modalHtml = '<div class="modal-dialog ' + modalCenter + ' ' + modalWidth + '"><div class="modal-content ' + modalHeight + '">' + closeButton + modalHeader + modalBody + modalFooter + '</div></div>';
                return modalHtml;
            },

            clearModal: function() {
                $('#site-modal').modal('hide');
                $('#site-modal').html('');
            },

        }
        // run init function
    var $core = new core();
    $core.init();

}());