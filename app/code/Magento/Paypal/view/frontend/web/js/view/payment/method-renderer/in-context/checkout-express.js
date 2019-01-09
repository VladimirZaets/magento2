/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define(
    [
        'underscore',
        'Magento_Paypal/js/view/payment/method-renderer/paypal-express-abstract',
        'Magento_Paypal/js/action/set-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Ui/js/lib/view/utils/dom-observer',
        'Magento_Customer/js/customer-data',
        'Magento_Ui/js/model/messageList',
        'Magento_Paypal/js/in-context/express-checkout-smart-buttons'
    ],
    function (
        _,
        Component,
        setPaymentMethodAction,
        additionalValidators,
        domObserver,
        customerData,
        messageList,
        checkoutSmartButtons
    ) {
        'use strict';

        // State of PayPal module initialization
        var clientInit = false;

        return Component.extend({

            defaults: {
                template: 'Magento_Paypal/payment/paypal-express-in-context'
            },

            /**
             * Render PayPal buttons using checkout.js
             */
            renderPayPalButtons: function () {
                this.clientConfig.payment = {
                    'method': this.item.method
                };
                this.clientConfig.quoteId = window.checkoutConfig.quoteData.entity_id;
                this.clientConfig.formKey = window.checkoutConfig.formKey;
                this.clientConfig.customerId = window.customerData.id;
                this.clientConfig.button = 0;
                this.clientConfig.merchantId = this.merchantId;
                this.clientConfig.validator = additionalValidators;
                    this.clientConfig.onClick = function () {
                        additionalValidators.validate();
                        this.selectPaymentMethod();
                };
                this.clientConfig.additionalAction = setPaymentMethodAction;
                this.clientConfig.rendererComponent = this;
                this.clientConfig.messageContainer = this.messageContainer;
                _.each(this.clientConfig, function (fn, name) {
                    if (typeof fn === 'function') {
                        this.clientConfig[name] = fn.bind(this);
                    }
                }, this);
                checkoutSmartButtons(this.clientConfig, '#' + this.getButtonId());
            },

            /**
             * @returns {String}
             */
            getButtonId: function () {
                return this.inContextId;
            },

            /**
             * @returns {String}
             */
            getAgreementId: function () {
                return this.inContextId + '-agreement';
            },
        });
    }
);
