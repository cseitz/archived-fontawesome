import * as React from "react";
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import tFA from "@fortawesome/fontawesome-common-types";
import type { FC } from 'react';

type FontawsesomeIconImport = {
    definition: tFA.IconDefinition,
    prefix: tFA.IconPrefix,
    iconName: tFA.IconName,
    width: number,
    height: number,
    ligatures: (string | number)[],
    unicode: string,
    svgPathData: string,
    aliases: (string | number)[],
}

export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brand';

export type IconProps<Styles extends any = IconStyle> = Omit<FontAwesomeIconProps, 'icon' | 'style'> & {
    style?: Styles;
    sx?: FontAwesomeIconProps['style'];
};

export type Icon<Styles = IconStyle> = FC<IconProps<Styles>> & {
    // @ts-ignore
    [P in Styles]: FontawsesomeIconImport
};

export const IconContext = React.createContext<Partial<IconProps>>({
    style: 'regular'
});

export type IconDefinition = {
    name: string;
    label: string;
    search: {
        terms: string[]
    },
    styles: string[];
    unicode: string;
    changes: string[];
    faName: string;
    imports?: any[];
    [key: string]: any;
}


const DEFAULT_STYLE = 'regular';


export function _defineIcon<D extends IconDefinition, I extends Record<string, any>>(def: D, styles: I): Icon<keyof I> {
    return Object.assign(function (props) {
        const ctx = React.useContext(IconContext);
        const {
            style = ctx?.style || DEFAULT_STYLE,
            sx = {},
            ...rest
        } = props;
        let svg = ((style as string) in styles ? styles[style] : styles[Object.keys(styles)[0]]);
        if (!svg) {
            throw new Error(`Missing icon pack! Please install '@cseitz/fontawesome-svg-${style}'`);
        } else if (svg instanceof Error) {
            throw svg;
        }
        return <FontAwesomeIcon style={sx} icon={svg?.definition} {...rest} />
    }, styles);
}

export const _tryRequire = (name) => {
    try {
        const found = require(name);
        if (found) return found;
    } catch(err) {}
    return new Error("Missing icon pack! Please install '" + name.split('/').slice(0, 2) + "'");
};


