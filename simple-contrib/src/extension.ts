import * as vscode from 'vscode';
import { bas, ICommandAction } from "@sap-devx/bas-platform-types";
import { ICollection, CollectionType, IItem, ManagerAPI } from "@sap-devx/guided-development-types";

const EXT_ID = "SAPOSS.simple-contrib";

export async function activate(context: vscode.ExtensionContext) {
    /**
     * The `bas-platform` extension provides an API for various platform capabilities, including
     * the construction of **actions**.
     * 
     * The `bas-platform` extension is guaranteed to be activated at this stage if you specify it in the `extensionDependencies`
     * section in your `package.json` file.
     * 
     * Also, make sure you include this entry in your `pacakge.json`:
     * ```js
     * "BASContributes": {
     *    "guided-development": {}
	 * }
     * ```
     * 
     * This indicates to the guided-development manager extension to activate your extension
     * when the user executes the Guided Development command.
     */
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;

    /**
     * An action of type **command** enables you to specify any vscode command
     * ([built-in](https://code.visualstudio.com/api/references/commands),
     * [simple](https://code.visualstudio.com/docs/getstarted/keybindings#_default-keyboard-shortcuts) or
     * [extension-provided commands](https://code.visualstudio.com/api/references/vscode-api#commands)).
     */
    const myAction: ICommandAction = new basAPI.actions.CommandAction();
    myAction.name = "Execute a Command";
    myAction.command.name = "workbench.action.showCommands";

    const itemId: string = "1";
    const myItem: IItem = {
        id: itemId,
        title: "My Simple Item",
        description: "This is my first item",
        labels: [],
        action1: myAction
    }

    /**
     * Collections reference **fully-qualified** item IDs so that other extensions can reuse the items.
     *
     * A fully-qualified item ID is in the form \<extension_id>.\<item_id>, where the extension_id is in the form \<publisher>.\<extension_name>
     * (as specified in `package.json`).
     */
    const myCollection: ICollection = {
        id: "a",
        title: "My Simple Collection",
        description: "This is my first colletion",
        type: CollectionType.Extension,
        itemIds: [`${EXT_ID}.${itemId}`]
    }

    /**
     * We wait for the guided-development manager to get activated before we send it our
     * collections and items.
     */
    basAPI.getExtensionAPI<ManagerAPI>("SAPOSS.guided-development").then((managerAPI) => {
        managerAPI.setData(EXT_ID, [myCollection], [myItem]);        
    });
}