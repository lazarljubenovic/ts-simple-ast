﻿import { expect } from "chai";
import { ManipulationSettings, ManipulationSettingsContainer, IndentationText } from "../options";
import { ts, NewLineKind, EditorSettings, IndentStyle } from "../typescript";
import { QuoteKind, UserPreferences } from "../compiler";
import { StringUtils } from "../utils";

describe(nameof(IndentationText), () => {
    // ensure this enum is correct. It's hard to read all the spaces since string enums can't use computed values

    it("should have a tab when has a tab", () => {
        expect(IndentationText.Tab).to.equal("\t");
    });

    it("should have two spaces when has two", () => {
        expect(IndentationText.TwoSpaces).to.equal(StringUtils.repeat(" ", 2));
    });

    it("should have four spaces when has four", () => {
        expect(IndentationText.FourSpaces).to.equal(StringUtils.repeat(" ", 4));
    });

    it("should have eight spaces when has eight", () => {
        expect(IndentationText.EightSpaces).to.equal(StringUtils.repeat(" ", 8));
    });
});

describe(nameof(ManipulationSettingsContainer), () => {
    function checkSettings(settings: ManipulationSettingsContainer, settingsSettings: ManipulationSettings) {
        expect(settings.get()).to.deep.equal(settingsSettings);
    }

    it("should have the correct defaults", () => {
        const settings = new ManipulationSettingsContainer();
        checkSettings(settings, {
            quoteKind: QuoteKind.Double,
            newLineKind: NewLineKind.LineFeed,
            indentationText: IndentationText.FourSpaces,
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true
        });
    });

    it("should set the settings when partially setting them", () => {
        const settings = new ManipulationSettingsContainer();
        settings.set({
            quoteKind: QuoteKind.Single
        });

        checkSettings(settings, {
            quoteKind: QuoteKind.Single,
            newLineKind: NewLineKind.LineFeed,
            indentationText: IndentationText.FourSpaces,
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true
        });
    });

    it("should set the settings when setting all of them", () => {
        const settings = new ManipulationSettingsContainer();
        settings.set({
            quoteKind: QuoteKind.Single,
            newLineKind: NewLineKind.CarriageReturnLineFeed,
            indentationText: IndentationText.EightSpaces,
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: false
        });

        checkSettings(settings, {
            quoteKind: QuoteKind.Single,
            newLineKind: NewLineKind.CarriageReturnLineFeed,
            indentationText: IndentationText.EightSpaces,
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: false
        });
    });

    describe(nameof<ManipulationSettingsContainer>(c => c.getEditorSettings), () => {
        function doTest(actual: EditorSettings, expected: EditorSettings) {
            expect(actual).is.deep.equal(expected);
        }

        it("should get the default editor settings", () => {
            doTest(new ManipulationSettingsContainer().getEditorSettings(), {
                convertTabsToSpaces: true,
                newLineCharacter: "\n",
                indentStyle: IndentStyle.Smart,
                indentSize: 4,
                tabSize: 4
            });
        });

        it("should get the correct editor settings after changing", () => {
            const container = new ManipulationSettingsContainer();
            container.getEditorSettings(); // fill the internal cache
            container.set({
                indentationText: IndentationText.Tab,
                newLineKind: NewLineKind.CarriageReturnLineFeed
            });

            doTest(container.getEditorSettings(), {
                convertTabsToSpaces: false,
                newLineCharacter: "\r\n",
                indentStyle: IndentStyle.Smart,
                indentSize: 1,
                tabSize: 1
            });
        });
    });

    describe(nameof<ManipulationSettingsContainer>(c => c.getUserPreferences), () => {
        function doTest(actual: UserPreferences, expected: UserPreferences) {
            expect(actual).is.deep.equal(expected);
        }

        it("should get the default preferences", () => {
            doTest(new ManipulationSettingsContainer().getUserPreferences(), {
                quotePreference: "double"
            });
        });

        it("should have a single preferences after changing it", () => {
            const container = new ManipulationSettingsContainer();
            container.set({ quoteKind: QuoteKind.Single });
            doTest(container.getUserPreferences(), {
                quotePreference: "single"
            });
        });
    });
});
