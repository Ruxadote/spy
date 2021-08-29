jQuery(function() {
    "use strict";
    var daftplug = jQuery('.daftplug');
    var header = daftplug.find('.daftplugHeader');
    var form = daftplug.find('.daftplugForm');
    var footer = daftplug.find('.daftplugFooter');
    var client = new ClientJS();
    var isMobile = client.getDeviceType() == 'mobile';
    var isAndroidChrome = client.getOS() == 'Android' &&  client.isChrome();
    var isAndroidFirefox = client.getOS() == 'Android' && client.isFirefox();
    var isAndroidOpera = client.getOS() == 'Android' && client.isOpera();
    var isIosSafari = client.getOS() == 'iOS' && client.isSafari();
    var isFullscreenOverlayShown = getCookie('fullscreenOverlay');
    var fullscreenOverlay = daftplug.find('.daftplugFullscreenOverlay');
    var chromeFullscreenOverlay = fullscreenOverlay.filter('.-chrome');
    var firefoxFullscreenOverlay = fullscreenOverlay.filter('.-firefox');
    var operaFullscreenOverlay = fullscreenOverlay.filter('.-opera');
    var safariFullscreenOverlay = fullscreenOverlay.filter('.-safari');
    var words = [
        "ბათუმი",
        "შოკოლადი",
        "ქუთაისი",
        "საბურთალო",
        "კაზინო",
        "იტალია",
        "ამერიკა",
        "ფეხბურთი",
        "კალათბურთი",
        "ჩხუბი",
        "ირანი",
        "ხინკალი",
        "ვაკე",
        "სავაჭრო ცენტრი",
        "საპირფარეშო",
        "რუსთავი",
        "მაკდონალდსი",
        "სკოლა",
        "მატარებელი",
        "ავტობუსი",
        "თურქეთი",
        "სოფელი",
        "საბილიარდო",
        "აფრიკა",
        "საფრანგეთი",
        "მუსიკა",
        "სოლარიუმი",
        "სილამაზის სალონი",
        "საავადმყოფო",
        "იუსტიციის სახლი",
        "რესტორანი",
        "რუსეთი",
        "ღამის კლუბი",
        "ნარკოტიკი",
        "ალკოჰოლი",
        "უნივერსიტეტი",
        "ევროპა",
        "კახეთი",
        "იმერეთი",
        "სამეგრელო",
        "სვანეთი",
        "რაჭა",
        "აფთიაქი",
        "პლიაჟი",
        "ტაქსი",
        "სააბაზანო",
        "სტადიონი",
        "ბოსტანი",
        "სასაფლაო",
        "ბანკი",
        "ციხე",
        "სასტუმრო",
        "უკრაინა",
        "ინგლისი",
        "თბილისი",
        "ეკლესია",
        "ფიტნეს დარბაზი",
        "ქორწილი",
        "ქელეხი",
        "ომი",
        "დუბაი",
        "ტყე",
        "საგიჟეთი",
        "ლიმონი",
        "ელიავა",
        "თეფში",
        "ტელეფონი",
        "სანთებელა",
        "ფული",
        "შეყვარებული",
        "დასვენება",
        "მანქანა",
        "ჩრდილოეთ კორეა",
        "ფონიჭალა",
        "სიგარეტი",
        "ძილი",
        "ყავა",
        "ცეკვა",
        "სიმღერა",
        "დაბადების დღე",
        "კითხვა",
        "აზერბაიჯანი",
        "წიწიბურა",
        "სნიკერსი",
        "კოკა-კოლა",
        "შაურმა",
        "სიცილი",
    ];
    var word;
    var playerCount;
    var spyCount;
    var time;
    var playersArray = [];
    var timerInterval;
    var touchstartTime;
    var touchTimeout;
    var touchIndex = 0;

    // Handle register serviceworker
    if (navigator.serviceWorker) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register(
                "https:\/\/daftplug.com\/spy\/serviceworker.js", {scope: "\/spy\/"}
            );
        });
    }

    // Check if PWA
    function isPwa() {
        return ['fullscreen', 'standalone', 'minimal-ui'].some(
            (displayMode) => window.matchMedia('(display-mode: '+displayMode+')').matches
        );
    }
    
    // Set cookie
    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    
    // Get cookie
    function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Remove cookie
    function removeCookie(name) {
        setCookie(name, '', -1);
    } 

    // Handle select input
    daftplug.find('.daftplugInputSelect').each(function(e) {
        var self = jQuery(this);
        var field = self.find('.daftplugInputSelect_field');
        var fieldOption = field.find('option');
        var label = jQuery('label[for="'+field.attr('id')+'"]');
        var placeholder = field.attr('data-placeholder');

        field.after(`<div class="daftplugInputSelect_dropdown"></div>
                     <span class="daftplugInputSelect_placeholder">${placeholder}</span>
                     <ul class="daftplugInputSelect_list"></ul>
                     <span class="daftplugInputSelect_arrow"></span>`);

        fieldOption.each(function(e) {
            self.find('.daftplugInputSelect_list').append(`<li class="daftplugInputSelect_option" data-value="${jQuery(this).val().trim()}">
                                                                    <a class="daftplugInputSelect_text">${jQuery(this).text().trim()}</a>
                                                                </li>`);
        });

        var dropdown = self.find('.daftplugInputSelect_dropdown');
        var list = self.find('.daftplugInputSelect_list');
        var option = self.find('.daftplugInputSelect_option');

        dropdown.add(list).attr('data-name', field.attr('name'));

        if (field.find('option:selected').length) {
            dropdown.attr('data-value', jQuery(this).find('option:selected').val()).text(jQuery(this).find('option:selected').text()).addClass('-hasValue');
            list.find('.daftplugInputSelect_option[data-value="'+jQuery(this).find('option:selected').val()+'"]').addClass('-selected');
        }

        option.on('click', function(e) {
            var self = jQuery(this);
            option.removeClass('-selected');
            self.addClass('-selected');
            fieldOption.prop('selected', false);
            field.find('option[value="'+self.attr('data-value')+'"]').prop('selected', true);
            dropdown.text(self.children().text()).addClass('-hasValue');
        });

        dropdown.add(label).on('click', function(e) {
            daftplug.find('.daftplugInputSelect_dropdown, .daftplugInputSelect_list').not(dropdown).not(list).removeClass('-open');
            e.stopPropagation();
            e.preventDefault();
            dropdown.toggleClass('-open');
            list.toggleClass('-open').scrollTop(0);
        });

        jQuery(document).on('click touch', function(e) {
            if (dropdown.hasClass('-open')) {
                dropdown.toggleClass('-open');
                list.removeClass('-open');
            }
        });

        field.on('invalid', function(e) {
        	self.addClass('-invalid');
            setTimeout(function(e) {
                self.removeClass('-invalid');
            }, 2300);
        });
    });

    // Handle range input
    daftplug.find('.daftplugInputRange').each(function(e) {
        var self = jQuery(this);
        var field = self.find('.daftplugInputRange_field');
        var val = parseFloat(field.val());
        var min = parseFloat(field.attr('min'));
        var max = parseFloat(field.attr('max'));

        field.after('<output class="daftplugInputRange_output">' + val + '</output>');
        var output = self.find('.daftplugInputRange_output');

        field.on('input change', function(e) {
            var val = parseFloat(field.val());
            var fillPercent = (100 * (val - min)) / (max - min);
            field.css('background', 'linear-gradient(to right, #ffeba7 0%, #ffeba7 ' + fillPercent + '%, #9ba0a9 ' + fillPercent + '%)');
            output.text(val);
        }).trigger('change');
    });

    // Handle form submit
    form.on('submit', function(e) {
        e.preventDefault();
        word = words[Math.floor(Math.random() * words.length)];
        playerCount = parseInt(daftplug.find('#playerCount').val());
        spyCount = parseInt(daftplug.find('#spyCount').val());
        time = 60 * parseInt(daftplug.find('#time').val());

        for (var i = 0; i < playerCount; i++) {
            if (i < spyCount) {
                playersArray.push(1);
            } else {
                playersArray.push(0); 
            }
        }

        playersArray.sort(() => 0.5 - Math.random());

        daftplug.find(header).add(form).add(footer).fadeOut(300, function(t) {
            daftplug.find('.daftplugGame').addClass('-started').find('.daftplugCard').delay(1000).fadeIn(400);
        });
    });

    // Handle card flip
    daftplug.find('.daftplugCard').on('touchstart mousedown', function(e) {
        e.preventDefault();
        var d = new Date();
        touchstartTime = d.getTime();
        touchTimeout = setTimeout(function() {
            daftplug.find('.daftplugCard_wrapper').addClass('-flipped');
            if (playersArray[touchIndex] == 1) {
                setTimeout(function() {
                    daftplug.find('.daftplugCardBack_result').hide().html(
                        '\n<img class="daftplugCardBack_img" src="assets/img/icon-150.png" alt="logo"/>\n<h2 class="daftplugCardBack_title" style="color: #bf202f;">ჩუმჩუმელა</h2>\n                            <p class="daftplugCardBack_desc" style="color: #c34450;">შენ ხარ ჩუმჩუმელა. არ შეიმჩნიო და ეცადე გაარკვიო რა სიტყვაზე ლაპარაკობენ მოქალაქეები.</p>\n'
                    ).fadeIn('fast');
                }, 100);
            } else {
                setTimeout(function() {
                    daftplug.find('.daftplugCardBack_result').hide().html(
                        `\n<img class="daftplugCardBack_img" src="assets/img/person.png" alt="person"/>\n<h2 class="daftplugCardBack_title">${word}</h2>\n<p class="daftplugCardBack_desc">შენ ხარ მოქალაქე. ეს სიტყვა ერთ-ერთმა მოქალაქემ არ იცის. დასვი კითხვები რათა გაარკვიო რომელი მათგანია ჩუმჩუმელა.</p>\n  `
                    ).fadeIn('fast');
                }, 100);
            }
        }, 300);
    });
    
    daftplug.find('.daftplugCard').on('touchend mouseup', function(e) {
        clearTimeout(touchTimeout);
        if ((new Date().getTime() - touchstartTime) > 300) {
            touchIndex++;
            console.log(touchIndex);
            daftplug.find('.daftplugCard_wrapper').removeClass('-flipped');
            setTimeout(function() {
                daftplug.find('.daftplugCardBack_result').text('');
            }, 300);
            if (touchIndex == playerCount) {
                daftplug.find('.daftplugCard').css('pointer-events', 'none');
                daftplug.find('.daftplugCardFront_result').hide().html('\n<h1 class="daftplugCardFront_timer"></h1>\n<p class="daftplugCardFront_desc">დაიწყეთ ერთმანეთისთვის კითხვების დასმა! იპოვეთ ჩუმჩუმელა დროის გასვლამდე, სხვა შემთხვევაში ის გაიმარჯვებს.</p>\n').fadeIn('fast');
                var timerElement = daftplug.find('.daftplugCardFront_timer');
                var timer = time, minutes, seconds;
                timerInterval = setInterval(function () {
                    minutes = parseInt(timer / 60, 10);
                    seconds = parseInt(timer % 60, 10);
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    seconds = seconds < 10 ? '0' + seconds : seconds;
                    timerElement.text(minutes + ':' + seconds);
                    if (--timer < 0) {
                        clearInterval(timerInterval);
                        touchIndex = 0;
                        playersArray = [];
                        daftplug.find('.daftplugCardBack_result').text('');
                        daftplug.find('.daftplugCardFront_result').hide().html('<h4 class="daftplugCardFront_timer">დრო გავიდა!</h1>').fadeIn('fast');
                    }
                }, 1000);
            }
        }
    });

    // Handle exit click
    daftplug.find('.daftplugButton.-exit').on('click', function() {
        daftplug.find('.daftplugGame').removeClass('-started').find('.daftplugCard').fadeOut(400, function() {
            clearInterval(timerInterval);
            touchIndex = 0;
            playersArray = [];
            daftplug.find('.daftplugCardBack_result').text('');
            daftplug.find('.daftplugCard').css('pointer-events', 'auto');
            daftplug.find(header).add(form).add(footer).fadeIn(400);
            daftplug.find('.daftplugCardFront_result').html('<h3 class="daftplugCardFront_title">დააჭირე და არ აუშვა</h3>');
        });
    });


    // Handle fullscreen installation overlays
    if (isMobile && isFullscreenOverlayShown == null && fullscreenOverlay.length && !isPwa()) {
        if (isAndroidChrome && chromeFullscreenOverlay.length) {
            var isFullscreenOverlayFired = false;
            var installPromptEvent = void 0;
            window.addEventListener('beforeinstallprompt', function(event) {
                event.preventDefault();
                installPromptEvent = event;
                if (!isFullscreenOverlayFired) {
                    setTimeout(function() {
                        chromeFullscreenOverlay.fadeIn('fast', function(e) {
                            isFullscreenOverlayFired = true;
                            chromeFullscreenOverlay.on('click', '.daftplugFullscreenOverlay_button', function(e) {
                                chromeFullscreenOverlay.fadeOut('fast', function(e) {
                                    setCookie('fullscreenOverlay', 'shown', 2);
                                    installPromptEvent.prompt();
                                    installPromptEvent = null;
                                });
                            });
                        });
                    }, 3000);
                }
            });
        } else if (isAndroidFirefox && firefoxFullscreenOverlay.length) {
            setTimeout(function() {
                firefoxFullscreenOverlay.fadeIn('fast');
            }, 3000);
        } else if (isAndroidOpera && operaFullscreenOverlay.length) {
            setTimeout(function() {
                operaFullscreenOverlay.fadeIn('fast');
            }, 3000);
        } else if (isIosSafari && safariFullscreenOverlay.length) {
            setTimeout(function() {
                safariFullscreenOverlay.fadeIn('fast');
            }, 3000);
        }
        
        fullscreenOverlay.on('click', '.daftplugFullscreenOverlay_close', function(e) {
            fullscreenOverlay.fadeOut('fast', function(e) {
                setCookie('fullscreenOverlay', 'shown', 2);
            });
        });
    }
});