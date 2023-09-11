/*! U(A)nfreeze.js 0.1.0
    Unreduced, freeze-free version of your user-agent
    https://github.com/faisalman/ua-unfreeze-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
/// <reference types="user-agent-data-types" />
export declare function unfreezeUA(ua?: string, ch?: UADataValues | Record<string, string>): Promise<string> | string;
