document.addEventListener('DOMContentLoaded', function () {
    function switchTab() {
        const faqItem = document.querySelectorAll('.faq-item'),
            faqElem = document.querySelectorAll('.faq-elem'),
            faqOverlay = document.querySelector('.faq-overlay');
        const actionSwitchTab = () => {
            for (let i = 0; i < faqItem.length; i++) {
                faqItem[i].addEventListener('click', function () {
                    if (!this.classList.contains('active')) {
                        faqOverlay.classList.add('active');
                        faqItem.forEach(item => {
                            if (item.className === 'faq-item active') {
                                item.classList.remove('active');
                            }
                        });
                        faqElem.forEach((item, index) => {
                            item.classList.remove('active');
                            if (index === i) {
                                this.classList.add('active');
                                setTimeout(() => {
                                        item.classList.add('active');
                                        faqOverlay.classList.remove('active');
                                    }
                                    , 300);
                            }
                        });
                    }
                });
            }
        };
        return actionSwitchTab();
    }

    switchTab();
});

