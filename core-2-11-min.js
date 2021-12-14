'use strict';
var ace = window.ace;
var te = window.te;
(te.App = function () {
    (this.appStateLog = ""),
        (this.appState = te.App.APP_STATE.DEFAULT),
        (this.isInitialized = !1),
        (this.isEditorInitialized = !1),
        (this.filename = null),
        (this.textFileSize = null),
        (this.textBlob = null),
        (this.encoding = null),
        (this.cachedDecodedText = null),
        (this.isSavingToDrive = !1),
        (this.wasSaveToDriveCancelled = !1),
        (this.driveFileId = null),
        (this.hasDownloadBeenAutoRetried = !1),
        (this.lastDownloadId = null),
        (this.doResumeOpenFromDriveAfterManualAuth = !1),
        (this.doResumeSaveToDriveAfterManualAuth = !1),
        (this.fileIdToOpen = null),
        (this.parentFolderId = null),
        (this.createdZipSavedToDriveId = null),
        (this.totalSessionSize = 0),
        (this.currentSessionProgress = 0),
        (this.isSessionClosed = !1),
        (this.isSessionAborted = !1),
        (this.sessionHasBeenRetried = !1),
        (this.sessionPropMap = {}),
        (this.hasAutoProceededWithDirectNewFlow = !1),
        (this.downloadingFilename = ""),
        (this.currentAutodetectedEncoding = null),
        (this.autoRefreshTokenTimer = null),
        (this.downloadingFilename = "");
}),
    (te.App.AUTO_TOKEN_REFRESH_INTERVAL_MINUTES = 29),
    (te.App.AUTO_TOKEN_REFRESH_INTERVAL_MILLIS = 1e3 * (60 * te.App.AUTO_TOKEN_REFRESH_INTERVAL_MINUTES)),
    (te.App.TEXTDECODER_ASCII = new TextDecoder("ascii")),
    (te.App.TEXTDECODER_UTF8 = new TextDecoder("utf-8")),
    (te.App.DEFAULT_PAGE_TITLE = "Text Edit - Free App for Editing Text Files"),
    (te.App.DEFAULT_TEXT_FILENAME = "Untitled.txt"),
    (te.App.DEFAULT_TEXT_FILE_EXTENSION = ".txt"),
    (te.App.DOCUMENT_REFERENCES = [
        "startPagePrompt",
        "startPageIconImg",
        "startPageIconImgDrive",
        "startPageIconImgGmail",
        "startPageIconImgGeneral",
        "startPageNewDetails",
        "startPageDriveDetails",
        "startPageDriveDetailsCallToAction",
        "startPageGmailDetails",
        "startPageGmailDetailsCallToAction",
        "startPageGeneralDetails",
        "startPageGeneralDetailsCallToAction",
        "checkingAuthSpinner",
        "authButtonContainer",
        "generalButtonContainer",
        "authButtonDetails",
        "profileImageDiv",
        "profileImageImg",
        "profileName",
        "openLocalFileInputEl",
        "topBanner",
        "startCard",
        "appContent",
        "mainWrapper",
        "centeredBodyContent",
        "mainApp",
        "fileTableHeader",
        "fileTableHeaderLabel",
        "fileTableHeaderSize",
        "fileTableContainer",
        "mainLabel",
        "secondaryLabel",
        "secondaryLabelContainer",
        "mainProgressBarContainer",
        "mainProgressBar",
        "selectAllCheckbox",
        "rootStatus",
        "rootStatusIcon",
        "rootStatusIconContainer",
        "rootStatusSpinner",
        "closeButton",
        "openFileFromDriveButton",
        "openFileFromComputerButton",
        "createNewTextFileButton",
        "openInDriveButton",
        "authButton",
        "retryButton",
        "cancelButton",
        "downloadAnchorEl",
        "mainScrollableContent",
        "mainBackgroundSpinner",
        "backgroundSpinnerText",
        "backgroundSpinnerTextFilename",
        "openButtonsContainer",
        "mainIcon",
        "mainSpinner",
        "textFilenameInputContainer",
        "textFilenameInput",
        "footer",
        "footer",
        "mainAppSubTitle",
        "mainEditor",
        "redoButton",
        "undoButton",
        "printButton",
        "wordWrapButton",
        "printMarginButton",
        "gotoLineButton",
        "findReplaceButton",
        "increaseFontSizeButton",
        "toggleNumbersButton",
        "tabsButton",
        "indentSoftWrapButton",
        "showInvisiblesButton",
        "themeButton",
        "keyboardShortcutsButton",
        "settingsMenuButton",
        "commandPalletteButton",
        "downloadButton",
        "saveToDriveButton",
        "appToolbar",
        "appTextHeader",
        "appCaption",
        "actionStatusLabel",
        "mainEditorContainer",
    ]),
    (te.App.SESS_PROP = {}),
    (te.App.SESS_PROP.DIDAUTHORIZE = "didAuthorize"),
    (te.App.SESS_PROP.DIDPREVIEW = "didPreview"),
    (te.App.SESS_PROP.DIDDOWNLOADFILE = "didDownloadFile"),
    (te.App.SESS_PROP.DIDFILEDOWNLOAD = "didFileDownloadSuccessfully"),
    (te.App.SESS_PROP.DIDPICKEXTRACTLOCATION = "didPickExtractLocation"),
    (te.App.SESS_PROP.DIDPICKLOCALFILE = "didPickLocalFile"),
    (te.App.SESS_PROP.DIDDRAGDROPFILE = "didDragDropFile"),
    (te.App.SESS_PROP.DIDPICKDRIVEFILE = "didPickDriveFile"),
    (te.App.SESS_PROP.DIDDOWNLOADSUBITEM = "didDownloadSubItem"),
    (te.App.SESS_PROP.DIDOPENFILE = "didOpenFile"),
    (te.App.SESS_PROP.DIDFILEOPEN = "didFileOpen"),
    (te.App.SESS_PROP.DIDFILERENDER = "didFileRender"),
    (te.App.SESS_PROP.DIDEXTRACTFILE = "didExtractFile"),
    (te.App.SESS_PROP.DIDFILEEXTRACT = "didFileExtract"),
    (te.App.SESS_PROP.DIDVIEWFILES = "didViewFiles"),
    (te.App.SESS_PROP.DIDCANCELDOWNLOAD = "didCancelDownload"),
    (te.App.SESS_PROP.DIDCANCELEXTRACTION = "didCancelExtraction"),
    (te.App.SESS_PROP.DIDRETRYDOWNLOAD = "didRetryDownload"),
    (te.App.SESS_PROP.DIDRETRYEXTRACTION = "didRetryExtraction"),
    (te.App.SESS_PROP.DIDCREATEFILE = "didCreateFile"),
    (te.App.SESS_PROP.DIDADDLOCALFILESTOFILE = "didAddLocalFilesToFile"),
    (te.App.APP_STATE = {
        DEFAULT: "default",
        INIT: "init",
        UNSUPPORTED_BROWSER: "unsupportedBrowser",
        NEW_SESSION: "newSession",
        PENDING_ZIP_LIBRARY_LOAD: "pendingZipLibraryLoad",
        APP_CREATE: "appCreate",
        APP_CREATED: "appCreated",
        APP_INIT: "appInit",
        ENCRYPTING_ZIP: "encryptingZip",
        ADD_PASSWORD_TO_ZIP: "addPasswordToZip",
        PASSWORD_REQUIRED: "passwordRequired",
        PASSWORD_INCORRECT: "passwordIncorrect",
        PASSWORD_VERIFIED: "passwordVerified",
        PASSWORD_FORMAT_NOT_SUPPORTED: "passwordFormatNotSupported",
        AUTH_PENDING_AUTO: "authPendingAuto",
        AUTH_PENDING_USER: "authPendingUser",
        AUTH_REQUIRED: "authRequired",
        AUTH_ERROR: "authError",
        AUTH_MISMATCH: "authMisMatch",
        DOWNLOADING: "downloading",
        DOWNLOADING_METADATA: "downloadingMetadata",
        CANCEL_DOWNLOAD_REQUESTED: "cancelDownloadRequested",
        DOWNLOAD_CANCELED: "downloadCanceled",
        DOWNLOAD_ALL_BYTES_TRANSFERRED: "downloadAllBytesTransferred",
        DOWNLOAD_FIRST_BYTE_TRANSFERRED: "downloadFirstByteTransferred",
        DOWNLOADED: "downloaded",
        DOWNLOAD_ERROR: "downloadError",
        ZIP_READING: "zipReading",
        ZIP_READ_ERROR: "zipReadError",
        MODEL_BUILDING: "modelBuilding",
        MODEL_BUILT: "modelBuilt",
        EXTRACTING: "extracting",
        EXTRACTION_COMPLETE: "extractionComplete",
        API_LOADED: "apiLoaded",
        READY_TO_EXTRACT: "readyToExtract",
        SESSION_CANCELED: "sessionCanceled",
        EXTRACTION_CANCEL_REQUESTED: "extractionCancelRequested",
        EXTRACTION_CANCELED: "extractionCanceled",
        RENDER_ZIP_UI: "renderZipUi",
        COMPLETE_WITH_ERRORS: "completeWithErrors",
        RARDECODE_LIBRARY_LOADING: "rardecodeLibraryLoading",
        BZIP_LIBRARY_LOADING: "bzipdecodeLibraryLoading",
        CREATEZIP_LIBRARY_LOADING: "createzipLibraryLoading",
        AESCRYPTO_LIBRARY_LOADING: "aescryptoLibraryLoading",
        JSCHARDET_LIBRARY_LOADING: "jschardetLibraryLoading",
        EDIT_ZIP: "editZip",
        ADDING_FILES_TO_ZIP: "addingFilesToZip",
        FILES_ADDED_TO_ZIP: "filesAddedToZip",
        ZIP_CREATION_ERROR: "zipCreationError",
        ZIP_CREATION_CANCELLED: "zipCreationCancelled",
        ZIP_ENCRYPTION_ERROR: "zipEncryptionError",
        ZIP_ENCRYPTION_CANCELLED: "zipEncryptionCancelled",
        EDITING: "editing",
    }),
    (te.App.ESTATE = {
        ADDED_TO_ZIP: "addedToZip",
        CREATED_ZIP_SAVED_TO_DRIVE: "createdZipSavedToDrive",
        DEFAULT: "default",
        QUEUED: "queued",
        QUEUED_PENDING_RETRY: "queuedPendingRetry",
        REQUEUED_AFTER_ERROR: "requeuedAfterError",
        SKIPPED: "skipped",
        PENDING: "pending",
        WAITING: "waiting",
        CANCELED: "canceled",
        BEGIN_DECOMPRESSION: "beginDecompression",
        DECOMPRESSION_PROGRESS: "decompressionProgress",
        DECOMPRESSION_COMPLETE: "decompressionComplete",
        DECOMPRESSION_ERROR: "decompressionError",
        BEGIN_UPLOAD: "beginUpload",
        UPLOAD_PROGRESS: "uploadProgress",
        UPLOAD_ERROR: "uploadError",
        UPLOAD_ALL_BYTES_TRANSFERRED: "uploadAllBytesTransferred",
        UPLOAD_COMPLETE: "uploadComplete",
        UPLOAD_ABORTED: "uploadAborted",
    }),
    (te.App.SESSION_ITEM_STATE_TYPE = {
        UPLOAD_ERROR: "uploadError",
        DECOMPRESSION_ERROR: "decompressionError",
        CANCELED: "canceled",
        AUTH_ERROR: "authError",
    }),
    (te.App.MAIN_ICON_TYPE = {
        SECURITY: "security",
        INFO: "info",
        WARNING: "warning",
        ERROR: "error",
        SPINNER: "spinner",
        CANCEL: "cancel",
        SUCCESS: "success",
        TEXT: "text",
        UNSAVED: "unsaved",
        NONE: "none",
    }),
    (te.App.NAME = "Text Edit"),
    (te.App.EXTRACTED_FOLDER_SUFFIX = "(Unzipped Files)"),
    (te.App.FILE_EXTENSION_REGEX = "/\\.[^/.]+$/"),
    (te.App.DRIVE_URL = "https://drive.google.com/drive/"),
    (te.App.FOLDER_SUFFIX = "folders/"),
    (te.App.DEFAULT_ZIP_FILENAME = "Untitled.zip"),
    (te.App.MAX_WORKQUEUE_WORKERS = 4),
    (te.App.TRANSFER_DECOMPRESS_MULTIPLIER = 1),
    (te.App.ENTRY_OVERHEAD_BYTES = 1e5),
    (te.App.createDriveFolderLink = function (e) {
        var t = "u/" + CURRENT_AUTH_USER + "/";
        return te.App.DRIVE_URL + t + (e ? te.App.FOLDER_SUFFIX + e : "");
    }),
    (te.App.getFolderName = function (e) {
        return te.App.trimFileExtension(e) + " " + te.App.EXTRACTED_FOLDER_SUFFIX;
    }),
    (te.App.endsWith = function (e, t) {
        return -1 !== e.indexOf(t, e.length - t.length);
    }),
    (te.App.startsWith = function (e, t) {
        return 0 == e.indexOf(t, 0);
    }),
    (te.App.stringContains = function (e, t) {
        return -1 != e.indexOf(t, 0);
    }),
    (te.App.trimFileExtension = function (e) {
        return e.replace(te.App.FILE_EXTENSION_REGEX, "");
    }),
    (te.App.getFileExtension = function (e) {
        if (null == e) return null;
        var t = e.trim().split(".");
        return 1 == t.length ? "" : t.pop().toLowerCase().trim();
    }),
    (te.App.trimLastFileExtension = function (e) {
        var t = e.split(".");
        return 1 == t.length ? e : (t.pop(), t.join("."));
    }),
    (te.App.execLater = function (e, t, o) {
        window.setTimeout(function () {
            e(), t && t();
        }, o || 0);
    }),
    (te.App.prototype.initAfterDomLoaded = function (e) {
        this.isInitialized ||
            ((this.isInitialized = !0), (this.fileIdToOpen = e), this.addDocumentReferences(), this.addEventListeners(), logImpression("app_initialized - initAfterDomLoaded()", "app_load", te.VERSION), this.startSessionAfterInit());
    }),
    (te.App.prototype.startSessionAfterInit = function () {
        if ((isAuthorized() && (this.updateUserInfoUi(), this.maybeEnableAutoRefreshTokenTimer()), this.fileIdToOpen)) isAuthorized() ? this.maybeDownloadAfterAuth() : isFirstAuthPending() || this.updateStartPageButtons();
        else if (isFirstAuthPending());
        else {
            var e = this.maybeProceedWithDirectNewFlow();
            e || (this.updateStartPageButtons(), this.startNewManualSession());
        }
    }),
    (te.App.prototype.maybeProceedWithDirectNewFlow = function () {
        return (
            !this.hasAutoProceededWithDirectNewFlow && !!isForDirectNewFlow() && ((this.hasAutoProceededWithDirectNewFlow = !0), logImpression("create_new_text_file_direct_new", "create_new_text_file"), this.doCreateNewEmptyTextFile(), !0)
        );
    }),
    (te.App.prototype.initializeEditorAfterDomLoaded = function () {
        if (!this.isEditorInitialized) {
            (this.isEditorInitialized = !0),
                console.log("TEXT EDITOR: initializeEditor()"),
                (EDITOR = ace.edit("mainEditor")),
                EDITOR.setTheme("ace/theme/chrome"),
                EDITOR.session.setMode("ace/mode/text"),
                EDITOR.setOption("showLineNumbers", !0),
                EDITOR.setOption("showGutter", !0),
                EDITOR.setOption("showPrintMargin", !1),
                EDITOR.setOption("wrap", !0),
                EDITOR.setOption("scrollPastEnd", 0.5),
                EDITOR.session.setOption("indentedSoftWrap", !1),
                EDITOR.getSession().setOption("tabSize", 4),
                EDITOR.setOption("useSoftTabs", !0),
                EDITOR.setOption("showInvisibles", !1),
                EDITOR.setReadOnly(!0),
                EDITOR.setFontSize(16);
            var e = this;
            EDITOR.on("input", function () {
                var t = EDITOR.getSession().getUndoManager();
                e.enableEl(e.redoButton, t.hasRedo()),
                    e.enableEl(e.undoButton, t.hasUndo()),
                    t.isClean()
                        ? (e.driveFileId ? ((e.actionStatusLabel.textContent = "Saved"), e.setMainIcon(te.App.MAIN_ICON_TYPE.SUCCESS)) : ((e.actionStatusLabel.textContent = ""), e.setMainIcon(te.App.MAIN_ICON_TYPE.NONE)),
                          e.enableEl(e.saveToDriveButton, !1))
                        : ((e.actionStatusLabel.textContent = "Unsaved changes"), e.setMainIcon(te.App.MAIN_ICON_TYPE.UNSAVED), e.enableEl(e.saveToDriveButton, !0));
            }),
                null != this.cachedDecodedText && (EDITOR.session.setValue(this.cachedDecodedText), EDITOR.session.getUndoManager().reset(), EDITOR.session.getUndoManager().markClean(), (this.cachedDecodedText = null)),
                EDITOR.commands.addCommand({
                    name: "save",
                    bindKey: { win: "Ctrl-S", mac: "Command-S" },
                    exec: function () {
                        e.isElementEnabled(e.saveToDriveButton) && e.handleSaveToDriveButtonClick();
                    },
                }),
                EDITOR.commands.addCommand({
                    name: "open",
                    bindKey: { win: "Ctrl-O", mac: "Command-O" },
                    exec: function () {
                        e.handleOpenFileFromDriveButtonClick();
                    },
                }),
                EDITOR.commands.addCommand({
                    name: "print",
                    bindKey: { win: "Ctrl-P", mac: "Command-P" },
                    exec: function () {
                        e.handlePrintButtonClick();
                    },
                }),
                te.App.execLater(function () {
                    EDITOR.resize(), e.maybeEnableEditor(), e.focusEditor();
                });
        }
    }),
    (te.App.prototype.getSource = function () {
        var e = null == this.fileIdToOpen ? "general" : getReferringSource();
        return null != this.fileIdToOpen && "gmail" != e && "zipextractor" != e && (e = "drive"), e;
    }),
    (te.App.prototype.enableEditor = function () {
        this.isEditorLoaded() && EDITOR.setReadOnly(!1);
    }),
    (te.App.prototype.maybeEnableEditor = function () {
        var e = this.getSource();
        "drive" == e || "gmail" == e || "zipextractor" == e || this.enableEditor();
    }),
    (te.App.prototype.checkStateUserAndLoggedInUserMatch = function () {
        var e = getLoggedInUserId();
        if (null == e) return !1;
        var t = getStateUserId();
        return !(null != t) || !("{userId}" != t) || t == e;
    }),
    (te.App.prototype.handleStateUserIdMismatchError = function () {
        logImpression("auth_account_mismatch", "auth", "authUser: " + CURRENT_AUTH_USER), this.setAppState(te.App.APP_STATE.AUTH_MISMATCH);
    }),
    (te.App.prototype.handleFirstAuthError = function () {
        this.setMainIcon(te.App.MAIN_ICON_TYPE.NONE);
        var e = this.maybeProceedWithDirectNewFlow();
        e || this.updateStartPageButtons();
    }),
    (te.App.prototype.handleFirstAuthSuccess = function () {
        this.handleAppPostAuthorizationTasks(), this.maybeEnableAutoRefreshTokenTimer();
    }),
    (te.App.prototype.handleAppPostAuthorizationTasks = function () {
        if ((this.updateUserInfoUi(), this.fileIdToOpen)) this.maybeDownloadAfterAuth();
        else {
            this.setMainIcon(te.App.MAIN_ICON_TYPE.NONE);
            var e = this.maybeProceedWithDirectNewFlow();
            e || this.updateStartPageButtons();
        }
    }),
    (te.App.prototype.maybeDownloadAfterAuth = function () {
        this.downloadInProgress(this.fileIdToOpen) || (this.checkStateUserAndLoggedInUserMatch() ? this.downloadFileById(this.fileIdToOpen) : this.handleStateUserIdMismatchError());
    }),
    (te.App.prototype.configureStartPageForNewManualSession = function () {
        (this.authButtonDetails.textContent = ""),
            this.showEl(this.startPageIconImgGeneral, !0),
            this.showEl(this.startPageIconImgGmail, !1),
            this.showEl(this.startPageIconImgDrive, !1),
            this.showEl(this.generalButtonContainer, !0),
            this.showEl(this.authButtonContainer, !1),
            this.showEl(this.authButton, !1),
            this.showEl(this.authButtonDetails, !1),
            this.showEl(this.checkingAuthSpinner, !1),
            this.showEl(this.startPageGeneralDetails, !0),
            this.showEl(this.startPageGeneralDetailsCallToAction, !0),
            document.getElementById("startPageGeneralDetailsCallToAction").removeAttribute("visibilityHidden"),
            this.showEl(this.startPageGmailDetails, !1),
            this.showEl(this.startPageGmailDetailsCallToAction, !1),
            this.showEl(this.startPageDriveDetails, !1),
            this.showEl(this.startPageDriveDetailsCallToAction, !1),
            this.showEl(this.startPageNewDetails, !1),
            this.showEl(this.startPagePrompt, !0);
    }),
    (te.App.prototype.updateStartPageButtons = function () {
        var e = null == this.fileIdToOpen ? "general" : getReferringSource();
        null != this.fileIdToOpen && "gmail" != e && (e = "drive");
        var t = "drive" == e,
            o = "gmail" == e,
            a = !(t || o || isForDirectNew);
        this.showEl(this.authButtonContainer, !a),
            this.showEl(this.authButton, !a),
            this.showEl(this.authButtonDetails, !a),
            this.showEl(this.checkingAuthSpinner, !1),
            this.showEl(this.generalButtonContainer, a),
            this.showEl(this.startPageGeneralDetails, a),
            a && document.getElementById("startPageGeneralDetailsCallToAction").removeAttribute("visibilityHidden"),
            this.showEl(this.startPageGmailDetails, o),
            o && document.getElementById("startPageGmailDetailsCallToAction").removeAttribute("visibilityHidden"),
            this.showEl(this.startPageDriveDetails, t),
            t && document.getElementById("startPageDriveDetailsCallToAction").removeAttribute("visibilityHidden"),
            this.showEl(this.startPageNewDetails, isForDirectNew),
            this.setMainIcon(te.App.MAIN_ICON_TYPE.NONE);
    }),
    (te.App.prototype.initiateManualAuth = function () {
        this.setAppState(te.App.APP_STATE.AUTH_PENDING_USER), authorize(!1, bindFn(this.handleManualAuthSuccess, this), bindFn(this.handleManualAuthError, this), getStateUserId(), void 0, !1, "initiateManualAuth");
    }),
    (te.App.prototype.handleManualAuthSuccess = function () {
        this.doResumeOpenFromGoogleDriveAfterManualAuth
            ? ((this.doResumeOpenFromGoogleDriveAfterManualAuth = !1), this.updateUserInfoUi(), this.showPicker(bindFn(this.handlePickerFileSelected, this)))
            : this.doResumeSaveToDriveAfterManualAuth
            ? ((this.doResumeSaveToDriveAfterManualAuth = !1), this.updateUserInfoUi(), this.saveFileToDrive())
            : (this.setAuthText("Signed in as " + getUserEmail()), this.handleAppPostAuthorizationTasks());
    }),
    (te.App.prototype.handleManualAuthError = function (e, t) {
        this.setAppState(te.App.APP_STATE.AUTH_ERROR, e, t);
    }),
    (te.App.prototype.updateUserInfoUi = function () {
        this.sessionPropMap[te.App.SESS_PROP.DIDAUTHORIZE] = !0;
        var e = te.App.htmlEscape(getUserEmail()),
            t = te.App.htmlEscape(getUserFullName()),
            o = te.App.htmlEscape(getUserGivenName());
        (this.profileImageImg.src = getUserPicture() + "?size=72"),
            (this.profileName.textContent = o),
            this.showEl(this.profileImageDiv, !0),
            this.showEl(this.profileName, !0),
            (this.profileImageImg.title = "Switch Google Account"),
            (this.profileName.title = t + " (" + e + ")");
    }),
    (te.App.htmlEscape = function (e) {
        return (e + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }),
    (te.App.prototype.setAppState = function (e, t, o, a) {
        (this.appState = e), (this.appStateLog += " " + e), this.updateViewFromAppState(t, o, a);
    }),
    (te.App.prototype.downloadInProgress = function (e) {
        return (
            this.lastDownloadId == e &&
            (this.appState == te.App.APP_STATE.DOWNLOADING_METADATA ||
                this.appState == te.App.APP_STATE.DOWNLOADING ||
                this.appState == te.App.APP_STATE.DOWNLOAD_ALL_BYTES_TRANSFERRED ||
                this.appState == te.App.APP_STATE.DOWNLOAD_FIRST_BYTE_TRANSFERRED ||
                this.appState == te.App.APP_STATE.DOWNLOAD_CANCELED ||
                this.appState == te.App.APP_STATE.CANCEL_DOWNLOAD_REQUESTED ||
                this.appState == te.App.APP_STATE.CANCEL_DOWNLOAD_ERROR)
        );
    }),
    (te.App.prototype.downloadFileById = function (e) {
        logImpression("download_file_metadata", "download", "start. is_authorized=" + isAuthorized()),
            (this.sessionPropMap[te.App.SESS_PROP.DIDDOWNLOADFILE] = !0),
            this.showEl(this.generalButtonContainer, !1, !0),
            this.showEl(this.authButtonContainer, !1),
            (this.lastDownloadId = e),
            this.setAppState(te.App.APP_STATE.DOWNLOADING_METADATA),
            this.showEl(this.mainScrollableContent, !1),
            (this.backgroundSpinnerText.textContent = "Opening..."),
            this.showEl(this.mainBackgroundSpinner, !0);
        var t = te.Dapi.generateCallbacks(bindFn(this.downloadFile, this), bindFn(this.onDownloadError, this), void 0, bindFn(this.onDownloadAborted, this));
        te.Dapi.get(e, t);
    }),
    (te.App.prototype.handleOpenFileFromDriveButtonClick = function () {
        logImpression("open_file_from_drive", "user_button", "is_authorized=" + isAuthorized());
        this.closeSession() && (!isAuthorized() || isTokenExpired() ? ((this.doResumeOpenFromGoogleDriveAfterManualAuth = !0), this.initiateManualAuth()) : this.showPicker(bindFn(this.handlePickerFileSelected, this)));
    }),
    (te.App.prototype.handleOpenWithOnFolder = function (e) {
        logImpression("open_with_on_folder", "misc"), this.closeSession();
        var t = 'Open text file from "' + e.name + '"';
        this.showPicker(bindFn(this.handlePickerFileSelected, this), !1, e.id, t);
    }),
    (te.App.prototype.downloadFile = function (e) {
        logImpression("download_file_blob", "download", "start");
        var t = e.size ? parseInt(e.size, 10) : -1;
        this.setAppState(te.App.APP_STATE.DOWNLOADING, e.name, t);
        var o = te.Dapi.generateCallbacks(bindFn(this.onDownloadSuccess, this, e), bindFn(this.onDownloadError, this), bindFn(this.onDownloadProgress, this, t), bindFn(this.onDownloadAborted, this));
        te.Dapi.downloadFileBytes(e.id, o);
    }),
    (te.App.prototype.onDownloadSuccess = function (e, t) {
        logImpression("download_file_blob", "download", "success"),
            (this.sessionPropMap[te.App.SESS_PROP.DIDFILEDOWNLOAD] = !0),
            this.setAppState(te.App.APP_STATE.DOWNLOADED),
            (this.parentFolderId = te.App.getParentIdOfDownloadedFile(e)),
            (this.driveFileId = e.id);
        var o = e.name.trim();
        this.initNewTextFile(o, t), (this.actionStatusLabel.textContent = ""), (this.backgroundSpinnerText.textContent = ""), (this.backgroundSpinnerTextFilename.textContent = ""), this.setMainIcon(te.App.MAIN_ICON_TYPE.NONE);
    }),
    (te.App.getParentIdOfDownloadedFile = function (e) {
        var t = e.parents;
        return t && 0 < t.length ? t[0] : null;
    }),
    (te.App.prototype.onDownloadError = function (e, t) {
        var o = "isAuthorized? " + isAuthorized() + " - isTokenExpired? " + isTokenExpired() + "; error: " + e,
            a = "";
        (a =
            this.appState == te.App.APP_STATE.DOWNLOADING
                ? "download_file_init_error"
                : this.appState == te.App.APP_STATE.DOWNLOAD_FIRST_BYTE_TRANSFERRED
                ? "download_file_blob_error"
                : this.appState == te.App.APP_STATE.DOWNLOADING_METADATA
                ? "download_file_metadata_error"
                : "download_file_other_error"),
            logImpression(a, "download", o);
        var n = this;
        this.hasDownloadBeenAutoRetried
            ? this.setAppState(te.App.APP_STATE.DOWNLOAD_ERROR, t)
            : ((this.hasDownloadBeenAutoRetried = !0),
              e == te.Dapi.ErrType.AUTH_ERROR
                  ? (this.setAppState(te.App.APP_STATE.AUTH_PENDING_AUTO),
                    authorize(
                        !0,
                        bindFn(this.downloadFileById, this, this.lastDownloadId),
                        function () {
                            n.setAppState(te.App.APP_STATE.DOWNLOAD_ERROR, "(Auth auto retry failed): " + t);
                        },
                        void 0,
                        CURRENT_AUTH_USER,
                        !1,
                        "onDownloadError"
                    ))
                  : this.downloadFileById(this.lastDownloadId));
    }),
    (te.App.prototype.onDownloadProgress = function (e, t, o) {
        if (this.appState != te.App.APP_STATE.DOWNLOAD_CANCELED && -1 != e) {
            var a = Math.round(3 + 97 * (t / o));
            (this.backgroundSpinnerText.textContent = "Opening... (" + a.toString() + "%)"),
                t === e ? this.setAppState(te.App.APP_STATE.DOWNLOAD_ALL_BYTES_TRANSFERRED) : this.appState == te.App.APP_STATE.DOWNLOADING && 0 < t && this.setAppState(te.App.APP_STATE.DOWNLOAD_FIRST_BYTE_TRANSFERRED);
        }
    }),
    (te.App.prototype.onDownloadAborted = function () {
        this.handleDownloadCanceled();
    }),
    (te.App.prototype.handleDownloadCanceled = function () {
        this.setAppState(te.App.APP_STATE.DOWNLOAD_CANCELED);
    }),
    (te.App.prototype.maybeEnableAutoRefreshTokenTimer = function () {
        null != this.autoRefreshTokenTimer || (this.autoRefreshTokenTimer = setTimeout(bindFn(this.doAutoRefreshToken, this), te.App.AUTO_TOKEN_REFRESH_INTERVAL_MILLIS));
    }),
    (te.App.prototype.doAutoRefreshToken = function () {
        clearTimeout(this.autoRefreshTokenTimer);
        var e = this;
        authorize(
            !0,
            function () {
                e.autoRefreshTokenTimer = setTimeout(bindFn(e.doAutoRefreshToken, e), te.App.AUTO_TOKEN_REFRESH_INTERVAL_MILLIS);
            },
            function (e) {
                logImpression("error", "auto_refresh_token", "err: " + e + "; isAuthorized: " + isAuthorized() + "; isTokenExpired: " + isTokenExpired());
            },
            void 0,
            CURRENT_AUTH_USER,
            !1,
            "autoRefreshToken",
            !0
        );
    }),
    (te.App.prototype.readBlobIntoEditor = function (e) {
        this.setAppState(te.App.APP_STATE.FILE_READING), logImpression("read_file", "file", "start");
        var t = this;
        te.App.blobToByteArrayAsync(
            e,
            0,
            e.size,
            function (o) {
                if (!("jschardet" in window)) window.console.log("error: jschardet lib not loaded; continuing with default encoding");
                else {
                    for (var a = "", n = 0; n < o.length && n < 2e4; ++n) a += String.fromCharCode(o[n]);
                    var r = jschardet.detect(a);
                    window.console.log(r), r && r.encoding ? (t.encoding = r.encoding.toLowerCase()) : console.log("unable to detect character encoding.");
                }
                var p = te.App.decodeStringFromByteArray(o, t.encoding);
                t.fileReadSuccess(e, p);
            },
            this.fileReadError
        );
    }),
    (te.App.prototype.initNewTextFile = function (e, t) {
        this.sessionPropMap[te.App.SESS_PROP.DIDCREATEFILE] = !0;
        var o = te.App.getFileExtension(e) || "";
        o = o.toLowerCase();
        var a = t ? o : "<new>";
        logImpression("init_new_text_file", "init", a),
            this.showEl(this.mainScrollableContent, !1),
            te.App.updatePageTitle(e),
            (this.filename = e),
            (this.textFilenameInput.value = e),
            this.updateEditorMode(),
            t ? (this.showEl(this.mainBackgroundSpinner, !0), this.readBlobIntoEditor(t)) : this.setAppState(te.App.APP_STATE.EDITING),
            this.showEl(this.mainBackgroundSpinner, !1),
            this.showEl(this.mainEditorContainer, !0);
        try {
            EDITOR.resize(), EDITOR.scrollToRow(-1), EDITOR.scrollToRow(0), EDITOR.resize();
        } catch (e) {
            logImpression("reset_scrollbar_error", "editor", e);
        }
        this.enableEditor();
    }),
    (te.App.ASCII_TABLE = [
        "\xC7",
        "\xFC",
        "\xE9",
        "\xE2",
        "\xE4",
        "\xE0",
        "\xE5",
        "\xE7",
        "\xEA",
        "\xEB",
        "\xE8",
        "\xEF",
        "\xEE",
        "\xEC",
        "\xC4",
        "\xC5",
        "\xC9",
        "\xE6",
        "\xC6",
        "\xF4",
        "\xF6",
        "\xF2",
        "\xFB",
        "\xF9",
        "\xFF",
        "\xD6",
        "\xDC",
        "\xF8",
        "\xA3",
        "\xD8",
        "\xD7",
        "\u0192",
        "\xE1",
        "\xED",
        "\xF3",
        "\xFA",
        "\xF1",
        "\xD1",
        "\xAA",
        "\xBA",
        "\xBF",
        "\xAE",
        "\xAC",
        "\xBD",
        "\xBC",
        "\xA1",
        "\xAB",
        "\xBB",
        "_",
        "_",
        "_",
        "\xA6",
        "\xA6",
        "\xC1",
        "\xC2",
        "\xC0",
        "\xA9",
        "\xA6",
        "\xA6",
        "+",
        "+",
        "\xA2",
        "\xA5",
        "+",
        "+",
        "-",
        "-",
        "+",
        "-",
        "+",
        "\xE3",
        "\xC3",
        "+",
        "+",
        "-",
        "-",
        "\xA6",
        "-",
        "+",
        "\xA4",
        "\xF0",
        "\xD0",
        "\xCA",
        "\xCB",
        "\xC8",
        "i",
        "\xCD",
        "\xCE",
        "\xCF",
        "+",
        "+",
        "_",
        "_",
        "\xA6",
        "\xCC",
        "_",
        "\xD3",
        "\xDF",
        "\xD4",
        "\xD2",
        "\xF5",
        "\xD5",
        "\xB5",
        "\xFE",
        "\xDE",
        "\xDA",
        "\xDB",
        "\xD9",
        "\xFD",
        "\xDD",
        "\xAF",
        "\xB4",
        "\xAD",
        "\xB1",
        "_",
        "\xBE",
        "\xB6",
        "\xA7",
        "\xF7",
        "\xB8",
        "\xB0",
        "\xA8",
        "\xB7",
        "\xB9",
        "\xB3",
        "\xB2",
        "_",
        " ",
    ]),
    (te.App.decodeASCIIBytes = function (e) {
        for (var t, o = "", a = 0; a < e.length; a++) (t = e[a]), (o += 127 < t ? te.App.ASCII_TABLE[t - 128] : String.fromCharCode(t));
        return o;
    }),
    (te.App.decodeStringFromByteArray = function (e, t) {
        try {
            return "TextDecoder" in window ? (t ? new TextDecoder(t).decode(e) : new TextDecoder().decode(e)) : te.App.utf8ByteArrayToString(e);
        } catch (t) {
            logImpression("decode_string_error", "decode", t);
            try {
                return te.App.decodeASCIIBytes(e);
            } catch (e) {
                return "Error: " + e;
            }
        }
    }),
    (te.App.prototype.fileReadSuccess = function (e, t) {
        logImpression("read_file", "file", "success"),
            (this.textBlob = e),
            (this.decodedText = t),
            this.setAppState(te.App.APP_STATE.EDITING),
            null != this.textFileSize,
            this.isEditorLoaded() ? (EDITOR.session.setValue(t), EDITOR.session.getUndoManager().reset(), EDITOR.session.getUndoManager().markClean()) : (this.cachedDecodedText = t);
    }),
    (te.App.prototype.addDocumentReferences = function () {
        for (var e = 0; e < te.App.DOCUMENT_REFERENCES.length; e++) this[te.App.DOCUMENT_REFERENCES[e]] = document.getElementById(te.App.DOCUMENT_REFERENCES[e]);
    }),
    (te.App.prototype.addEventListeners = function () {
        this.addButtonListeners(),
            (this.openLocalFileInputEl.onchange = bindFn(this.handleOpenLocalFileInputElChange, this)),
            (this.profileImageImg.onclick = bindFn(this.handleProfileImageImgClick, this)),
            this.textFilenameInput.addEventListener("keydown", bindFn(this.handleTextFilenameKeyDown, this)),
            window.addEventListener("beforeunload", bindFn(this.handleBeforeUnload, this)),
            this.textFilenameInput.addEventListener("focus", function () {
                this.select(), (this.style.cursor = "text");
            }),
            this.textFilenameInput.addEventListener("blur", bindFn(this.handleTextFilenameInputBlur, this));
    }),
    (te.App.prototype.handleProfileImageImgClick = function () {
        this.switchAccount();
    }),
    (te.App.prototype.isEditorLoaded = function () {
        return "EDITOR" in window && null != EDITOR;
    }),
    (te.App.prototype.isGapiLibraryLoaded = function () {
        return "gapi" in window;
    }),
    (te.App.prototype.switchAccount = function () {
        if ((logImpression("switch_account", "auth", "start. currentAuthUser=" + CURRENT_AUTH_USER), !(this.isGapiLibraryLoaded() && gapi.auth2))) return void logImpression("switch_account", "auth", "error: gapi_auth2_not_loaded");
        var e = this;
        this.setAuthText("Choose the Google account you would like to use with Text Editor."),
            authorize(
                !1,
                function () {
                    logImpression("switch_account", "auth", "success. currentAuthUser=" + CURRENT_AUTH_USER), e.setAuthText("Signed in as " + getUserEmail()), e.updateUserInfoUi();
                },
                function (t) {
                    e.setAuthText(""), logImpression("switch_account", "auth", "error: " + t);
                },
                void 0,
                void 0,
                !0,
                "switchAccount"
            );
    }),
    (te.App.prototype.handleBeforeUnload = function (t) {
        if ((this.sendFinalSessionState(), !!this.isEditorLoaded()) && EDITOR.session && EDITOR.session.getUndoManager() && !EDITOR.session.getUndoManager().isClean()) {
            var e = 'The file "' + this.filename + '" has unsaved changes.\n\nAre you sure you want to leave this page?';
            return (t.returnValue = e), e;
        }
    }),
    (te.App.prototype.sendFinalSessionState = function () {
        for (var e in (logImpression("final_state_recorded", "session_state2", !0, void 0, void 0, !0),
        logImpression(this.appStateLog, "app_state_log", void 0, void 0, void 0, !0),
        logImpression("recorded", "final_app_state", !0, void 0, void 0, !0),
        logImpression(this.appState, "final_app_state", void 0, void 0, void 0, !0),
        te.App.SESS_PROP))
            if (te.App.SESS_PROP.hasOwnProperty(e)) {
                var t = this.sessionPropMap[te.App.SESS_PROP[e]];
                null != t && logImpression(te.App.SESS_PROP[e], "session_state2", t, void 0, void 0, !0);
            }
    }),
    (te.App.prototype.handleTextFilenameInputBlur = function () {
        this.textFilenameInput.value = "" == this.textFilenameInput.value ? te.App.DEFAULT_TEXT_FILENAME : this.textFilenameInput.value.trim();
        var e = this.textFilenameInput.value.toLowerCase();
        te.App.endsWith(e, ".") || "" != te.App.getFileExtension(e) || (this.textFilenameInput.value += te.App.DEFAULT_TEXT_FILE_EXTENSION);
        var t = this.filename == this.textFilenameInput.value;
        if (((this.filename = this.textFilenameInput.value), (this.textFilenameInput.style.cursor = "pointer"), te.App.updatePageTitle(this.filename), !t && this.driveFileId)) {
            var o = te.Dapi.generateCallbacks(bindFn(this.renameComplete, this), bindFn(this.renameError, this), bindFn(this.renameProgress, this), bindFn(this.renameAborted, this));
            (this.actionStatusLabel.textContent = "Renaming file..."), this.setMainIcon(te.App.MAIN_ICON_TYPE.SPINNER), te.Dapi.updateFileMetadata(o, this.driveFileId, this.filename), this.enableEl(this.textFilenameInput, !1);
        }
        this.updateEditorMode();
    }),
    (te.App.prototype.updateEditorMode = function () {
        try {
            var e = getModeForPath(this.filename).mode;
            EDITOR.session.setMode(e);
            var t = "ace/mode/text" == e;
            EDITOR.setOption("showLineNumbers", !t), EDITOR.setOption("showGutter", !t);
        } catch (e) {
            logImpression("mode_set_error", "editor", e), console.log(e);
        }
    }),
    (te.App.prototype.renameComplete = function () {
        logImpression("rename_file_success", "rename"), this.enableEl(this.textFilenameInput, !0), (this.actionStatusLabel.textContent = "File renamed"), this.setMainIcon(te.App.MAIN_ICON_TYPE.SUCCESS);
    }),
    (te.App.prototype.renameError = function (e) {
        logImpression("rename_file_error", "rename", e), this.enableEl(this.textFilenameInput, !0), (this.actionStatusLabel.textContent = "File rename error"), this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING);
    }),
    (te.App.prototype.renameProgress = function () {}),
    (te.App.prototype.renameAborted = function (e) {
        logImpression("rename_file_aborted", "rename", e), (this.actionStatusLabel.textContent = "File rename aborted"), this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING);
    }),
    (te.App.prototype.fileUploadError = function (e, t) {
        logImpression("save_upload_file_error", "save", "error: " + t),
            this.enableEl(this.saveToDriveButton, !0),
            this.setProgressBarPercent(100),
            this.maybeRefreshCredentials(t),
            this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING),
            (this.actionStatusLabel.textContent = "Save error. Unsaved changes");
    }),
    (te.App.prototype.fileUploadAborted = function (e, t, o) {
        logImpression("upload_file_aborted", "save", "message: " + o),
            this.enableEl(this.saveToDriveButton, !0),
            this.setProgressBarPercent(100),
            this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING),
            (this.actionStatusLabel.textContent = "Save error. Unsaved changes");
    }),
    (te.App.prototype.fileUploadProgress = function (e, t) {
        console.log("file Upload Progress");
        var o = Math.round(3 + 97 * (e / t));
        this.setProgressBarPercent(o);
    }),
    (te.App.prototype.handleTextFilenameKeyDown = function (t) {
        return "Escape" === t.key || "Esc" === t.key
            ? (t.stopPropagation(), t.preventDefault(), "" == this.textFilenameInput.value ? ((this.textFilenameInput.value = this.filename || ""), this.textFilenameInput.blur(), !1) : ((this.textFilenameInput.value = ""), !1))
            : "Enter" === t.key
            ? (t.stopPropagation(), t.preventDefault(), this.textFilenameInput.blur(), !1)
            : void 0;
    }),
    (te.App.prototype.handleBodyKeydown = function (t) {
        "Escape" === t.key || "Esc" === t.key
            ? this.isPreviewShown()
                ? (t.preventDefault(), this.closePreview())
                : this.isInZipEditMode
                ? (t.preventDefault(), this.closeZipEditMode(), this.zipEntryTree && this.zipEntryTree.originalEntries && 0 == this.zipEntryTree.originalEntries.length && this.canCloseSession() && (t.preventDefault(), this.closeSession()))
                : this.canCloseSession() && (logImpression("close", "user_button"), t.preventDefault(), this.closeSession())
            : "ArrowUp" === t.key || "Up" === t.key || "ArrowLeft" === t.key || "Left" === t.key
            ? this.isPreviewShown() && (t.preventDefault(), this.handlePreviewPrevButtonClick())
            : "ArrowDown" === t.key || "Down" === t.key || "ArrowRight" === t.key || "Right" === t.key
            ? this.isPreviewShown() && (t.preventDefault(), this.handlePreviewNextButtonClick())
            : "Enter" === t.key && this.isPreviewShown() && this.isElementShown(this.previewDownloadButton) && !this.isElementShown(this.previewErrorContent) && (t.preventDefault(), this.handlePreviewDownloadButtonClick());
    }),
    (te.App.prototype.addButtonListeners = function () {
        for (var e, t = 0; t < te.App.DOCUMENT_REFERENCES.length; t++) (e = te.App.DOCUMENT_REFERENCES[t]), e && te.App.endsWith(e, "Button") && (this[e].onclick = bindFn(this.handleButtonClick, this, e));
    }),
    (te.App.prototype.showEl = function (e, t) {
        e.hidden = !t;
    }),
    (te.App.prototype.enableEl = function (e, t) {
        e.disabled = !t;
    }),
    (te.App.prototype.isElementShown = function (e) {
        return !e.hidden;
    }),
    (te.App.prototype.isElementEnabled = function (e) {
        return !e.disabled;
    }),
    (te.App.prototype.handleSaveToDriveButtonClick = function (e) {
        logImpression("save_to_drive_button", "user_button"),
            (this.sessionPropMap[te.App.SESS_PROP.DIDSAVETODRIVE] = !0),
            !isAuthorized() || isTokenExpired()
                ? (this.setAppState(te.App.APP_STATE.AUTH_PENDING_USER), (this.doResumeSaveToDriveAfterManualAuth = !0), this.initiateManualAuth())
                : ((this.sessionHasBeenRetried = !1), this.saveFileToDrive(e), this.focusEditor());
    }),
    (te.App.prototype.handlePrintButtonClick = function () {
        logImpression("print_button", "user_button"), this.printDoc(), this.focusEditor();
    }),
    (te.App.prototype.handleButtonClick = function (e) {
        switch ((window.console.log("button click on: " + e), e)) {
            case "authButton":
                logImpression("manual_authorize_button", "user_button"), this.initiateManualAuth();
                break;
            case "saveToDriveButton":
                this.handleSaveToDriveButtonClick();
                break;
            case "downloadButton":
                logImpression("download_button", "user_button"), (this.sessionPropMap[te.App.SESS_PROP.DIDDOWNLOADCOPY] = !0);
                var t = this.exportEditorBlob();
                this.downloadBlobToBrowser(this.filename, t), this.focusEditor();
                break;
            case "openInDriveButton":
                if (this.driveFileId) {
                    logImpression("open_in_drive", "user_button"), (this.sessionPropMap[te.App.SESS_PROP.DIDOPENINDRIVE] = !0);
                    var o = "https://drive.google.com/open?id=" + this.driveFileId,
                        a = window.open(o, "_blank");
                    a && a.focus && a.focus();
                }
                this.focusEditor();
                break;
            case "cancelButton":
                this.appState == te.App.APP_STATE.EXTRACTING
                    ? (logImpression("cancel_extraction", "user_button"), (this.sessionPropMap[te.App.SESS_PROP.DIDCANCELEXTRACTION] = !0), this.setAppState(te.App.APP_STATE.EXTRACTION_CANCEL_REQUESTED), this.abortSession())
                    : this.appState == te.App.APP_STATE.DOWNLOADING ||
                      this.appState == te.App.APP_STATE.DOWNLOAD_FIRST_BYTE_TRANSFERRED ||
                      this.appState == te.App.APP_STATE.DOWNLOAD_ALL_BYTES_TRANSFERRED ||
                      this.appState == te.App.APP_STATE.DOWNLOADING_METADATA
                    ? (logImpression("cancel_download", "user_button", "app_state: " + this.appState),
                      (this.sessionPropMap[te.App.SESS_PROP.DIDCANCELDOWNLOAD] = !0),
                      this.setAppState(te.App.APP_STATE.CANCEL_DOWNLOAD_REQUESTED),
                      te.Dapi.abortDownload())
                    : this.appState == te.App.APP_STATE.ADDING_FILES_TO_ZIP && ((this.addFilesToZipCancelRequested = !0), this.enableEl(this.cancelButton, !1)),
                    this.focusEditor();
                break;
            case "closeButton":
                logImpression("close", "user_button"), this.closeSession();
                break;
            case "retryButton":
                this.appState == te.App.APP_STATE.COMPLETE_WITH_ERRORS
                    ? (logImpression("retry_errors", "user_button"), (this.sessionPropMap[te.App.SESS_PROP.DIDRETRYEXTRACTION] = !0), (this.sessionHasBeenRetried = !1), this.doExtract(!1))
                    : this.appState == te.App.APP_STATE.EXTRACTION_CANCELED
                    ? (logImpression("retry_after_extraction_canceled", "user_button"), (this.sessionPropMap[te.App.SESS_PROP.DIDRETRYEXTRACTION] = !0), (this.sessionHasBeenRetried = !1), this.doExtract(!1))
                    : (this.appState == te.App.APP_STATE.DOWNLOAD_ERROR || this.appState == te.App.APP_STATE.DOWNLOAD_CANCELED) &&
                      (logImpression("retry_download", "user_button"), (this.sessionPropMap[te.App.SESS_PROP.DIDRETRYDOWNLOAD] = !0), (this.hasDownloadBeenAutoRetried = !1), this.downloadFileById(this.lastDownloadId)),
                    this.focusEditor();
                break;
            case "openFileFromDriveButton":
                this.handleOpenFileFromDriveButtonClick();
                break;
            case "createNewTextFileButton":
                logImpression("create_new_text_file", "user_button", "is_authorized=" + isAuthorized()), logImpression("create_new_text_file_button_press", "create_new_text_file"), this.doCreateNewEmptyTextFile();
                break;
            case "openFileFromComputerButton":
                logImpression("open_file_from_computer", "user_button", "is_authorized=" + isAuthorized()), this.openLocalFileInputEl.click();
                break;
            case "increaseFontSizeButton":
                logImpression("increase_font_size", "user_button");
                var n = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32],
                    r = EDITOR.getFontSize(),
                    p = n.indexOf(r),
                    i = 6;
                -1 != p && ((i = p + 1), i == n.length && (i = 0));
                var s = n[i];
                EDITOR.setFontSize(s), this.focusEditor();
                break;
            case "undoButton":
                logImpression("undo_button", "user_button"), EDITOR.undo(), this.focusEditor();
                break;
            case "redoButton":
                logImpression("redo_button", "user_button"), EDITOR.redo(), this.focusEditor();
                break;
            case "findReplaceButton":
                logImpression("find_button", "user_button"), EDITOR.searchBox ? (EDITOR.searchBox.active ? EDITOR.searchBox.hide() : EDITOR.searchBox.show()) : EDITOR.execCommand("find");
                break;
            case "wordWrapButton":
                logImpression("word_wrap", "user_button");
                var l = "off" == EDITOR.getOption("wrap");
                if (l) EDITOR.setOption("wrap", "free");
                else {
                    var d = "free" == EDITOR.getOption("wrap");
                    if (d) {
                        var E = !1 == EDITOR.getOption("showPrintMargin");
                        E ? EDITOR.setOption("wrap", "off") : EDITOR.setOption("wrap", "printMargin");
                    } else EDITOR.setOption("wrap", "off");
                }
                this.focusEditor();
                break;
            case "printMarginButton":
                logImpression("print_margin", "user_button");
                var E = !1 == EDITOR.getOption("showPrintMargin");
                if (E) EDITOR.setOption("showPrintMargin", !0), EDITOR.setOption("printMargin", 80);
                else {
                    var A = 80 == EDITOR.getOption("printMargin");
                    A ? EDITOR.setOption("printMargin", 100) : EDITOR.setOption("showPrintMargin", !1);
                }
                this.focusEditor();
                break;
            case "toggleNumbersButton":
                logImpression("toggle_numbers", "user_button"), EDITOR.setOption("showLineNumbers", !1 == EDITOR.getOption("showLineNumbers")), EDITOR.setOption("showGutter", !1 == EDITOR.getOption("showGutter")), this.focusEditor();
                break;
            case "gotoLineButton":
                logImpression("goto_line", "user_button"), EDITOR.execCommand("gotoline");
                break;
            case "tabsButton":
                logImpression("tabs_button", "user_button");
                var u = !EDITOR.getOption("useSoftTabs");
                if (u) EDITOR.setOption("useSoftTabs", !0), EDITOR.getSession().setOption("tabSize", 2);
                else {
                    var c = 2 == EDITOR.getSession().getOption("tabSize");
                    c ? EDITOR.getSession().setOption("tabSize", 4) : EDITOR.setOption("useSoftTabs", !1);
                }
                this.focusEditor();
                break;
            case "indentSoftWrapButton":
                logImpression("indent_soft_wrap_button", "user_button");
                var D = EDITOR.getSession().getOption("indentedSoftWrap");
                EDITOR.getSession().setOption("indentedSoftWrap", !D), this.focusEditor();
                break;
            case "lineBreakButton":
                this.focusEditor();
                break;
            case "showInvisiblesButton":
                logImpression("invisible_chars_buton", "user_button"), EDITOR.setOption("showInvisibles", !EDITOR.getOption("showInvisibles")), this.focusEditor();
                break;
            case "printButton":
                this.handlePrintButtonClick();
                break;
            case "themeButton":
                logImpression("theme_button", "user_button");
                var T = "ace/theme/chrome" == EDITOR.getTheme();
                if (T) EDITOR.setTheme("ace/theme/twilight");
                else {
                    var _ = "ace/theme/twilight" == EDITOR.getTheme();
                    _ ? EDITOR.setTheme("ace/theme/cobalt") : EDITOR.setTheme("ace/theme/chrome");
                }
                this.focusEditor();
                break;
            case "keyboardShortcutsButton":
                EDITOR.showKeyboardShortcuts
                    ? EDITOR.showKeyboardShortcuts()
                    : ace.config.loadModule("ace/ext/keybinding_menu", function (e) {
                          e.init(EDITOR), EDITOR.showKeyboardShortcuts();
                      });
                break;
            case "settingsMenuButton":
                EDITOR.execCommand("showSettingsMenu");
                break;
            case "commandPalletteButton":
                EDITOR.execCommand("openCommandPallete");
                break;
            default:
        }
    }),
    (te.App.prototype.doCreateNewEmptyTextFile = function () {
        this.initNewTextFile(te.App.DEFAULT_TEXT_FILENAME), this.focusEditor();
    }),
    (te.App.prototype.canCancel = function () {
        return this.isElementShown(this.cancelButton) && this.isElementEnabled(this.cancelButton);
    }),
    (te.App.prototype.canRetry = function () {
        return this.isElementShown(this.retryButton) && this.isElementEnabled(this.retryButton);
    }),
    (te.App.prototype.canCloseSession = function () {
        return this.isElementShown(this.closeButton);
    }),
    (te.App.prototype.exportEditorBlob = function () {
        var e = this.exportEditorContentsAsUtf8ByteArray();
        return te.App.byteArrayToBlob(e, "application/octet-stream");
    }),
    (te.App.prototype.exportEditorContentsAsUtf8ByteArray = function () {
        var e = EDITOR.getValue();
        return "TextEncoder" in window ? new TextEncoder().encode(e) : te.App.stringToUtf8ByteArray(e);
    }),
    (te.App.stringToUtf8ByteArray = function (e) {
        for (var t, o = [], a = 0, n = 0; n < e.length; n++)
            (t = e.charCodeAt(n)),
                128 > t
                    ? (o[a++] = t)
                    : 2048 > t
                    ? ((o[a++] = 192 | (t >> 6)), (o[a++] = 128 | (63 & t)))
                    : 55296 == (64512 & t) && n + 1 < e.length && 56320 == (64512 & e.charCodeAt(n + 1))
                    ? ((t = 65536 + ((1023 & t) << 10) + (1023 & e.charCodeAt(++n))), (o[a++] = 240 | (t >> 18)), (o[a++] = 128 | (63 & (t >> 12))), (o[a++] = 128 | (63 & (t >> 6))), (o[a++] = 128 | (63 & t)))
                    : ((o[a++] = 224 | (t >> 12)), (o[a++] = 128 | (63 & (t >> 6))), (o[a++] = 128 | (63 & t)));
        return new Uint8Array(o);
    }),
    (te.App.stringToRawByteArray = function (e) {
        for (var t, o = [], a = 0, n = 0; n < e.length; n++) (t = e.charCodeAt(n)), 255 < t && ((o[a++] = 255 & t), (t >>= 8)), (o[a++] = t);
        return o;
    }),
    (te.App.byteArrayToBlob = function (e, t) {
        var o = {};
        return t && (o.type = t), new Blob([e], o);
    }),
    (te.App.utf8ByteArrayToString = function (e) {
        for (var t = [], o = 0, a = 0; o < e.length; ) {
            var n = e[o++];
            if (128 > n) t[a++] = String.fromCharCode(n);
            else if (191 < n && 224 > n) {
                var r = e[o++];
                t[a++] = String.fromCharCode(((31 & n) << 6) | (63 & r));
            } else if (239 < n && 365 > n) {
                var r = e[o++],
                    p = e[o++],
                    i = e[o++],
                    s = (((7 & n) << 18) | ((63 & r) << 12) | ((63 & p) << 6) | (63 & i)) - 65536;
                (t[a++] = String.fromCharCode(55296 + (s >> 10))), (t[a++] = String.fromCharCode(56320 + (1023 & s)));
            } else {
                var r = e[o++],
                    p = e[o++];
                t[a++] = String.fromCharCode(((15 & n) << 12) | ((63 & r) << 6) | (63 & p));
            }
        }
        return t.join("");
    }),
    (te.App.prototype.printDoc = function () {
        try {
            var e = window.open("", "", "height=400,width=800");
            e.document.write("<html><head><title>" + this.filename + "</title>"),
                e.document.write("</head><body style=\"font-family: 'Roboto Mono', monospace; font-size: 16px;\"><h1>" + this.filename + "</h1>"),
                e.document.write("<span>"),
                e.document.write(EDITOR.getSession().getDocument().getValue().split("\n").join("<br/>")),
                e.document.write("</span></body></html>"),
                e.document.close(),
                e.print();
        } catch (e) {
            console.error("Error: " + e);
        }
    }),
    (te.App.prototype.focusEditor = function () {
        var e = this;
        te.App.execLater(function () {
            try {
                console.log("setting focus to main editor"), e.isEditorLoaded() && EDITOR.focus();
            } catch (e) {
                console.log(e);
            }
        });
    }),
    (te.App.prototype.updateViewFromAppState = function (e, t) {
        if (this.isInitialized)
            switch (this.appState) {
                case te.App.APP_STATE.API_LOADED:
                    break;
                case te.App.APP_STATE.AUTH_PENDING_AUTO:
                    break;
                case te.App.APP_STATE.AUTH_PENDING_USER:
                    this.setAuthText('Authorization is pending your approval. Click "Allow" in the popup window to use Text Editor.');
                    break;
                case te.App.APP_STATE.AUTH_MISMATCH:
                    this.setAuthText("The account you authorized (" + getUserEmail() + ") does not match the account you used to open the file. Please try again.");
                    break;
                case te.App.APP_STATE.AUTH_ERROR:
                    var o = "";
                    "popup_closed_by_user" == e
                        ? (o = "You closed the popup window before completing authorization. Please try again.")
                        : ("idpiframe_initialization_failed" == e
                              ? (o = "There was a problem showing the authorization screen; please try again.")
                              : "popup_blocked_by_browser" == e
                              ? (o = "Your web browser blocked the Google authorization popup window. Please enable popups.")
                              : "access_denied" == e
                              ? ((o = "You chose not grant access to Text Editor. You may try again with the Authorize button on the left."), (t = ""))
                              : (o = "General authorization error; please try again."),
                          t && (o += " (Details: " + t + ")")),
                        this.setAuthText(o),
                        this.doResumeOpenFromGoogleDriveAfterManualAuth
                            ? (this.doResumeOpenFromGoogleDriveAfterManualAuth = !1)
                            : this.doResumeSaveToDriveAfterManualAuth
                            ? (this.doResumeSaveToDriveAfterManualAuth = !1)
                            : (this.showEl(this.authButton, !0), this.showEl(this.authButtonDetails, !0));
                    break;
                case te.App.APP_STATE.CANCEL_DOWNLOAD_REQUESTED:
                    this.enableEl(this.cancelButton, !1);
                    break;
                case te.App.APP_STATE.DOWNLOAD_CANCELED:
                    this.showEl(this.cancelButton, !1),
                        this.enableEl(this.cancelButton, !0),
                        this.showEl(this.retryButton, !0),
                        this.showEl(this.closeButton, !0),
                        (this.actionStatusLabel.textContent = "Opening canceled"),
                        this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING),
                        this.setProgressBarPercent(100);
                    break;
                case te.App.APP_STATE.DOWNLOADING_METADATA:
                    this.updateDownloadingFilename(""),
                        this.showEl(this.cancelButton, !0),
                        this.enableEl(this.cancelButton, !0),
                        this.showEl(this.retryButton, !1),
                        this.showEl(this.closeButton, !1),
                        (this.actionStatusLabel.textContent = ""),
                        (this.backgroundSpinnerText.textContent = "Opening...");
                    break;
                case te.App.APP_STATE.DOWNLOADING:
                    e && this.updateDownloadingFilename(e, t);
                    break;
                case te.App.APP_STATE.DOWNLOAD_ALL_BYTES_TRANSFERRED:
                    break;
                case te.App.APP_STATE.DOWNLOAD_FIRST_BYTE_TRANSFERRED:
                    break;
                case te.App.APP_STATE.DOWNLOADED:
                    this.showEl(this.cancelButton, !1);
                    break;
                case te.App.APP_STATE.DOWNLOAD_ERROR:
                    this.updateUiForDownloadError(e);
                    break;
                case te.App.APP_STATE.INIT:
                    break;
                case te.App.APP_STATE.FILE_READ_ERROR:
                    this.showEl(this.closeButton, !0), this.showEl(this.cancelButton, !1), (this.actionStatusLabel.textContent = "Error reaing file: " + e), this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING);
                    break;
                case te.App.APP_STATE.EDITING:
                    this.showEl(this.closeButton, !0),
                        this.showEl(this.cancelButton, !1),
                        this.showEl(this.generalButtonContainer, !1, !0),
                        this.showEl(this.downloadButton, !0),
                        this.showEl(this.saveToDriveButton, !0),
                        this.showEl(this.appToolbar, !0),
                        this.showEl(this.textFilenameInputContainer, !0),
                        this.showEl(this.appTextHeader, !1),
                        this.showEl(this.appCaption, !1),
                        this.showEl(this.actionStatusLabel, !0);
                    break;
                case te.App.APP_STATE.READY_TO_EXTRACT:
                    this.promptToExtract(e, t);
                    break;
                case te.App.APP_STATE.FILE_READING:
                    break;
                case te.App.APP_STATE.NEW_SESSION:
                    break;
                default:
                    throw "Unexpected state: " + this.appState;
            }
    }),
    (te.App.prototype.setMainIcon = function (e) {
        if (e == te.App.MAIN_ICON_TYPE.NONE) this.showEl(this.mainSpinner, !1), this.showEl(this.mainIcon, !1);
        else if (e == te.App.MAIN_ICON_TYPE.SPINNER) this.showEl(this.mainSpinner, !0), this.showEl(this.mainIcon, !1);
        else {
            var t = this.getMainHeaderConfigByType(e);
            (this.mainIcon.textContent = t.iconKey), (this.mainIcon.style.color = t.color), this.showEl(this.mainIcon, !0), this.showEl(this.mainSpinner, !1);
        }
    }),
    (te.App.prototype.getMainHeaderConfigByType = function (e) {
        var t = {};
        switch (e) {
            case te.App.MAIN_ICON_TYPE.WARNING:
                (t.iconKey = "warning"), (t.color = "#d00000"), (t.backgroundColor = "lightyellow");
                break;
            case te.App.MAIN_ICON_TYPE.ERROR:
                (t.iconKey = "error_outline"), (t.color = "#d00000"), (t.backgroundColor = "lightyellow");
                break;
            case te.App.MAIN_ICON_TYPE.CANCEL:
                (t.iconKey = "warning"), (t.color = "#d00000");
                break;
            case te.App.MAIN_ICON_TYPE.SUCCESS:
                (t.iconKey = "cloud_done"), (t.color = "");
                break;
            case te.App.MAIN_ICON_TYPE.SECURITY:
                (t.iconKey = "security"), (t.color = "#1a73e8"), (t.backgroundColor = "lightyellow");
                break;
            case te.App.MAIN_ICON_TYPE.ADD:
                (t.iconKey = "add_circle_outline"), (t.backgroundColor = ""), (t.color = "");
                break;
            case te.App.MAIN_ICON_TYPE.INFO:
                (t.iconKey = "info_outline"), (t.backgroundColor = ""), (t.color = "");
                break;
            case te.App.MAIN_ICON_TYPE.TEXT:
                (t.iconKey = "notes"), (t.backgroundColor = ""), (t.color = "");
                break;
            case te.App.MAIN_ICON_TYPE.UNSAVED:
                (t.iconKey = "info_outline"), (t.info_outline = ""), (t.color = "");
                break;
            default:
                (t.iconKey = "info_outline"), (t.color = ""), (t.backgroundColor = "");
        }
        return t;
    }),
    (te.App.prototype.handleProgress = function (e, t) {
        var o = Math.round(3 + 97 * (e / t));
        return o;
    }),
    (te.App.updatePageTitle = function (e) {
        document.title = e ? e + " - " + te.App.NAME : te.App.NAME;
    }),
    (te.App.resetPageTitle = function () {
        document.title = te.App.DEFAULT_PAGE_TITLE;
    }),
    (te.App.prototype.updateUiForFileComplete = function (e) {
        if (!e.root) {
            var t = te.App.getFilenameCell(e);
            t.style.color = "#1a73e8";
            var o = te.App.getIconCell(e);
            (o.style.color = "#1a73e8"), (o.style.opacity = "0.8");
        }
    }),
    (te.App.prototype.setProgressBarPercent = function (e) {
        te.App.doSetProgressBarPercent(e, this.mainProgressBar);
    }),
    (te.App.doSetProgressBarPercent = function (e, t) {
        -1 === e || (t.firstElementChild.style.width = e.toString() + "%");
    }),
    (te.App.prototype.setAuthText = function (e) {
        this.authButtonDetails.textContent = e;
        this.showEl(this.authButtonDetails, !!e);
    }),
    (te.App.prototype.saveFileToDrive = function (e) {
        this.setMainIcon(te.App.MAIN_ICON_TYPE.SPINNER),
            EDITOR.session.getUndoManager().markClean(),
            !e && this.driveFileId ? this.createOrUpdateFileInDrive(!1, null, this.driveFileId) : this.createOrUpdateFileInDrive(!0, getParentFolderId(), null, e);
    }),
    (te.App.prototype.createOrUpdateFileInDrive = function (e, t, o, a) {
        this.enableEl(this.saveToDriveButton, !1);
        var n = te.Dapi.generateCallbacks(bindFn(this.fileUploadComplete, this, !!a), bindFn(this.fileUploadError, this), bindFn(this.fileUploadProgress, this), bindFn(this.fileUploadAborted, this)),
            r = a ? "Saving copy..." : "Saving...",
            p = this.exportEditorBlob();
        e ? ((this.actionStatusLabel.textContent = "Saving..."), te.Dapi.uploadFile(n, p, this.filename, t)) : ((this.actionStatusLabel.textContent = "Saving..."), te.Dapi.updateFileContent(n, p, o, this.filename));
    }),
    (te.App.prototype.fileUploadComplete = function (e, t) {
        logImpression("upload_file", "save", "success"),
            this.setProgressBarPercent(100),
            EDITOR.session.getUndoManager().isClean()
                ? ((this.actionStatusLabel.textContent = "Saved"), this.enableEl(this.saveToDriveButton, !1), this.setMainIcon(te.App.MAIN_ICON_TYPE.SUCCESS))
                : ((this.actionStatusLabel.textContent = "Unsaved changes"), this.enableEl(this.saveToDriveButton, !0), this.setMainIcon(te.App.MAIN_ICON_TYPE.UNSAVED)),
            (this.driveFileId = t.id);
    }),
    (te.App.prototype.updateDownloadingFilename = function (e) {
        (this.backgroundSpinnerTextFilename.textContent = e), (this.downloadingFilename = e), this.showEl(this.appCaption, !1);
    }),
    (te.App.prototype.showPicker = function (e, t, o, a) {
        var n = bindFn(this.showPickerInternal, this, e, t, o, a);
        gapi.load("picker", { callback: n });
    }),
    (te.App.prototype.showPickerInternal = function (e, t, o, a) {
        t ? this.showFolderPicker(bindFn(this.pickerFolderChosenInternalCallback, this, e)) : this.showFilePicker(bindFn(this.pickerFileChosenInternalCallback, this, e), o, a);
    }),
    (te.App.prototype.pickerFileChosenInternalCallback = function (e, t) {
        if (!(t.action == google.picker.Action.PICKED)) logImpression("show_file_picker", "picker", "other_data_action: " + t.action);
        else if (t.docs && 0 < t.docs.length) {
            logImpression("show_file_picker", "picker", "file_picked");
            var o = t.docs[0];
            e(o);
        } else logImpression("show_file_picker", "picker", "no_file_picked_in_data");
    }),
    (te.App.prototype.pickerFolderChosenInternalCallback = function (e, t) {
        if (!(t.action == google.picker.Action.PICKED)) logImpression("show_folder_picker", "picker", "other_data_action: " + t.action);
        else if (t.docs && 0 < t.docs.length) {
            logImpression("show_folder_picker", "picker", "folder_picked");
            var o = t.docs[0];
            e(o);
        } else logImpression("show_folder_picker", "picker", "no_folder_picked_in_data");
    }),
    (te.App.prototype.showFilePicker = function (e, t, o) {
        logImpression("show_file_picker", "picker", "show");
        var a = new google.picker.DocsView(google.picker.ViewId.DOCS).setSelectFolderEnabled(!1).setIncludeFolders(!1).setMode(google.picker.DocsViewMode.LIST);
        t && a.setParent(t);
        var n = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setAppId(APP_CONFIG.appId)
            .setOAuthToken(getAccessToken())
            .setDeveloperKey(APP_CONFIG.apiKey)
            .setCallback(e)
            .addView(a)
            .setTitle(o || "Open text file from Google Drive")
            .build();
        n.setVisible(!0);
    }),
    (te.App.prototype.showFolderPicker = function (e) {
        logImpression("show_folder_picker", "picker", "show");
        var t = new google.picker.DocsView(google.picker.ViewId.DOCS).setSelectFolderEnabled(!0).setIncludeFolders(!0).setMode(google.picker.DocsViewMode.LIST).setMimeTypes(te.Dapi.MimeType.FOLDER),
            o = detectDevice(),
            a = "phone" == o ? "Select a Google Drive folder" : "Select a Google Drive folder for extracted files",
            n = new google.picker.PickerBuilder().enableFeature(google.picker.Feature.NAV_HIDDEN).setAppId(APP_CONFIG.appId).setOAuthToken(getAccessToken()).setDeveloperKey(APP_CONFIG.apiKey).setCallback(e).addView(t).setTitle(a).build();
        n.setVisible(!0);
    }),
    (te.App.prototype.closeSession = function (e) {
        if ((this.isSessionClosed, EDITOR && !EDITOR.session.getUndoManager().isClean())) {
            var t = 'The file "' + this.filename + '" has unsaved changes.\n\nAre you sure you want to close this file?',
                o = confirm(t);
            if (!o) return !1;
        }
        return (
            te.App.resetPageTitle(),
            (this.textBlob = null),
            (this.lastDownloadId = null),
            (this.hasDownloadBeenAutoRetried = !1),
            (this.fileIdToOpen = null),
            (this.driveFileId = null),
            (this.encoding = null),
            (this.filename = ""),
            (this.backgroundSpinnerText.textContent = ""),
            (this.backgroundSpinnerTextFilename.textContent = ""),
            (this.cachedDecodedText = null),
            (this.doResumeSaveToDriveAfterManualAuth = !1),
            (this.doResumeOpenFromDriveAfterManualAuth = !1),
            clearState(),
            EDITOR && (EDITOR.session.setValue(""), EDITOR.session.getUndoManager().reset(), EDITOR.session.getUndoManager().markClean(), EDITOR.scrollToLine(0, !0, !0, function () {}), EDITOR.gotoLine(0, 0, !0)),
            this.startNewManualSession(e),
            !0
        );
    }),
    (te.App.prototype.startNewManualSession = function (e) {
        this.setAppState(te.App.APP_STATE.NEW_SESSION),
            (this.appCaption.textContent = "Free app for editing text files"),
            (this.textFilenameInput.value = ""),
            (this.actionStatusLabel.textContent = ""),
            this.showEl(this.retryButton, !1),
            this.showEl(this.closeButton, !1),
            this.showEl(this.appToolbar, !1),
            this.showEl(this.appCaption, !0),
            this.enableEl(this.openInDriveButton, !1),
            this.showEl(this.openInDriveButton, !1),
            this.showEl(this.cancelButton, !1),
            this.showEl(this.textFilenameInputContainer, !1),
            this.showEl(this.appTextHeader, !0),
            this.showEl(this.mainScrollableContent, !0),
            this.showEl(this.mainBackgroundSpinner, !1),
            this.showEl(this.mainEditorContainer, !1),
            this.showEl(this.mainIcon, !1),
            this.showEl(this.downloadButton, !1),
            this.showEl(this.saveToDriveButton, !1),
            this.setProgressBarPercent(0),
            e || this.configureStartPageForNewManualSession(),
            this.setMainIcon(te.App.MAIN_ICON_TYPE.NONE),
            this.focusEditor();
    }),
    (te.App.prototype.hideWelcomeText = function () {
        this.showEl(this.generalButtonContainer, !1), this.showEl(this.authButtonContainer, !1), this.showEl(this.startPagePrompt, !1);
    }),
    (te.App.utf8d = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        8,
        8,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        10,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        3,
        3,
        11,
        6,
        6,
        6,
        5,
        8,
        8,
        8,
        8,
        8,
        8,
        8,
        8,
        8,
        8,
        8,
        0,
        1,
        2,
        3,
        5,
        8,
        7,
        1,
        1,
        1,
        4,
        6,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        3,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
    ]);
var inline;
(te.App.isValidUtf8 = function (e) {
    for (var t = 0, o = 0, a = 0, n = 0; n < e.length; n++) if (((o = e[n]), (a = te.App.utf8d[o]), (t = te.App.utf8d[256 + 16 * t + a]), 1 != t)) return !1;
    return !0;
}),
    (te.App.prototype.updateUiForDownloadError = function (e) {
        this.showEl(this.cancelButton, !1), this.showEl(this.retryButton, !0), this.showEl(this.closeButton, !0);
        (this.actionStatusLabel.textContent = "Unable to open file: " + (e || "Unknown error")), this.setMainIcon(te.App.MAIN_ICON_TYPE.WARNING);
    }),
    (te.App.blobToDataViewAsync = function (e, t, o, a, n) {
        te.App.blobToArrayLikeAsync(!0, e, t, o, a, n);
    }),
    (te.App.blobToByteArrayAsync = function (e, t, o, a, n) {
        te.App.blobToArrayLikeAsync(!1, e, t, o, a, n);
    }),
    (te.App.blobToArrayLikeAsync = function (t, o, a, n, r, p) {
        var i = new FileReader();
        if (
            ((i.onload = function (o) {
                var e = o.target.result;
                null == e && (e = i.result), t ? r(new DataView(e)) : r(new Uint8Array(e));
            }),
            (i.onerror = function () {
                var e = i.error;
                p(e);
            }),
            0 == a && n == o.size)
        )
            i.readAsArrayBuffer(o);
        else {
            var s = o.slice(a, n);
            i.readAsArrayBuffer(s);
        }
    }),
    (te.App.prototype.downloadBlobToBrowser = function (e, t) {
        logImpression("download_blob_to_browser_start", "download_blob_to_browser");
        var o = window.URL || window.webkitURL,
            a = this.downloadAnchorEl,
            n = o.createObjectURL(t);
        a.setAttribute("href", n), a.setAttribute("download", e), a.setAttribute("target", "_blank"), (a.textContent = e);
        try {
            a.click(), logImpression("download_blob_to_browser_success", "download_blob_to_browser");
        } catch (e) {
            logImpression("download_blob_to_browser_error", "download_blob_to_browser", e);
        }
    }),
    (te.App.prototype.handlePickerFileSelected = function (e) {
        (this.sessionPropMap[te.App.SESS_PROP.DIDPICKDRIVEFILE] = !0), this.closeSession(!0), this.downloadFileById(e.id);
    }),
    (te.App.prototype.handlePickerFolderSelected = function (e) {
        (this.sessionPropMap[te.App.SESS_PROP.DIDPICKEXTRACTLOCATION] = !0), (this.parentFolderId = e.id), this.setSecondaryLabelLinkText(e.name);
    }),
    (te.App.prototype.handleOpenLocalFileInputElChange = function (t) {
        if (!this.isProcessingOpenLocalFileInputEl) {
            this.isProcessingOpenLocalFileInputEl = !0;
            var e = t.target.files[0];
            if (((this.openLocalFileInputEl.value = ""), e)) {
                (this.sessionPropMap[te.App.SESS_PROP.DIDPICKLOCALFILE] = !0), this.closeSession(!0);
                var o = e.name.trim();
                this.updateDownloadingFilename(o, e.size), this.initNewTextFile(o, e), (this.actionStatusLabel.textContent = ""), this.setMainIcon(te.App.MAIN_ICON_TYPE.NONE);
            } else;
            this.isProcessingOpenLocalFileInputEl = !1;
        }
    }),
    (te.App.sanitizeDriveFilename = function (e) {
        return null == e
            ? null
            : e
                  .replace("/", "_")
                  .replace("?", "_")
                  .replace("*", "_")
                  .replace("+", "_")
                  .replace(",", "_")
                  .replace(":", "_")
                  .replace(";", "_")
                  .replace("<", "_")
                  .replace("=", "_")
                  .replace(">", "_")
                  .replace("\\", "_")
                  .replace("[", "_")
                  .replace("]", "_");
    }),
    (te.App.prototype.flashTimer = null),
    (te.App.prototype.flashElement = function (e, t, o, a, n, r) {
        clearTimeout(this.flashTimer);
        var p = null == n ? e.style.backgroundColor : n,
            i = r || 0,
            s = this,
            l = function () {
                (e.style.backgroundColor = 0 == i % 2 ? t : p), i++, i < 2 * o && (s.flashTimer = setTimeout(bindFn(s.flashElement, s, e, t, o, a, p, i), a));
            };
        l();
    }),
    (te.Dapi = {}),
    (te.Dapi.activeRequests = []),
    (te.Dapi.ApiUrl = { UPLOAD: "https://www.googleapis.com/upload/drive/v3/files/", FILES: "https://www.googleapis.com/drive/v3/files/" }),
    (te.Dapi.ErrType = {
        FORBIDDEN: "forbidden",
        FILE_NOT_FOUND: "fileNotFound",
        DEADLINE_EXCEEDED: "deadlineExceeded",
        SERVER_ERROR: "serverError",
        AUTH_ERROR: "authError",
        BAD_REQUEST: "badRequest",
        REQUEST_ABORTED: "requestAborted",
        UNKNOWN: "unknown",
    }),
    (te.Dapi.ErrMsg = {
        FORBIDDEN: "There was a problem with the server request; please try again",
        FILE_NOT_FOUND: "You do not have read access to this file; try a different Google account",
        DEADLINE_EXCEEDED: "The server took too long to respond; please try again",
        SERVER_ERROR: "An internal server error occurred; please try again",
        AUTH_ERROR: "An authorization error occured; please refresh this page and re-authorize",
        BAD_REQUEST: "The server request could not be understood; please report this error to the developers",
        REQUEST_ABORTED: "The request was aborted when it was still in progress",
        UNKNOWN: "An unknown error occurred; please try again or report this error to the developers",
        XHR_NETWORK: "Network request failed. Please check that you are online and try again",
    }),
    (te.Dapi.XHR_ERROR_CODES = {
        403: te.Dapi.ErrType.FORBIDDEN,
        404: te.Dapi.ErrType.FILE_NOT_FOUND,
        500: te.Dapi.ErrType.SERVER_ERROR,
        503: te.Dapi.ErrType.DEADLINE_EXCEEDED,
        401: te.Dapi.ErrType.AUTH_ERROR,
        400: te.Dapi.ErrType.BAD_REQUEST,
        0: te.Dapi.ErrType.REQUEST_ABORTED,
    }),
    (te.Dapi.getErrorMessage = function (e, t) {
        return e === te.Dapi.ErrType.FORBIDDEN
            ? te.Dapi.ErrMsg.FORBIDDEN + (t ? " (" + t + ")" : "")
            : e === te.Dapi.ErrType.FILE_NOT_FOUND
            ? te.Dapi.ErrMsg.FILE_NOT_FOUND
            : e === te.Dapi.ErrType.SERVER_ERROR
            ? te.Dapi.ErrMsg.SERVER_ERROR
            : e === te.Dapi.ErrType.DEADLINE_EXCEEDED
            ? te.Dapi.ErrMsg.DEADLINE_EXCEEDED
            : e === te.Dapi.ErrType.AUTH_ERROR
            ? te.Dapi.ErrMsg.AUTH_ERROR
            : e === te.Dapi.ErrType.BAD_REQUEST
            ? te.Dapi.ErrMsg.BAD_REQUEST
            : e === te.Dapi.ErrType.REQUEST_ABORTED
            ? te.Dapi.ErrMsg.REQUEST_ABORTED
            : te.Dapi.ErrMsg.UNKNOWN;
    }),
    (te.Dapi.DEFAULT_FIELDS_GET = "id,name,size,parents,mimeType"),
    (te.Dapi.DEFAULT_FIELDS_CREATE = "id"),
    (te.Dapi.Method = { POST: "POST", GET: "GET", PUT: "PUT", PATCH: "PATCH", DELETE: "DELETE" }),
    (te.Dapi.CbType = { SUCCESS: "success", ERROR: "error", PROGRESS: "progress", ABORT: "abort" }),
    (te.Dapi.MimeType = { JSON: "application/json", FOLDER: "application/vnd.google-apps.folder" }),
    (te.Dapi.XhrResponseType = { BLOB: "blob", JSON: "json", TEXT: "text" }),
    (te.Dapi.CRLF = "\r\n"),
    (te.Dapi.MULTIPART_BOUNDARY_STRING = "314159265358979323846"),
    (te.Dapi.MULTIPART_DELIMITER = te.Dapi.CRLF + "--" + te.Dapi.MULTIPART_BOUNDARY_STRING + te.Dapi.CRLF),
    (te.Dapi.MULTIPART_CLOSE_DELIMITER = te.Dapi.CRLF + "--" + te.Dapi.MULTIPART_BOUNDARY_STRING + "--"),
    (te.Dapi.MULTIPART_CONTENT_TYPE = 'multipart/related; boundary="' + te.Dapi.MULTIPART_BOUNDARY_STRING + '"'),
    (te.Dapi.generateCallbacks = function (e, t, o, a) {
        var n = {};
        return (n[te.Dapi.CbType.SUCCESS] = e), (n[te.Dapi.CbType.ERROR] = t), o && (n[te.Dapi.CbType.PROGRESS] = o), a && (n[te.Dapi.CbType.ABORT] = a), n;
    }),
    (te.Dapi.abortDownload = function () {
        var e = te.Dapi.getDownloadXhr();
        e && e.abort();
    }),
    (te.Dapi.getDownloadXhr = function () {
        return 0 < te.Dapi.activeRequests.length ? te.Dapi.activeRequests[0] : null;
    }),
    (te.Dapi.get = function (e, t) {
        var o = { fields: te.Dapi.DEFAULT_FIELDS_GET, supportsAllDrives: "true" };
        te.Dapi.sendXhr(t, te.Dapi.Method.GET, te.Dapi.ApiUrl.FILES + e, o);
    }),
    (te.Dapi.list = function (e) {
        var t = { fields: te.Dapi.DEFAULT_FIELDS_LIST, supportsAllDrives: "true" };
        te.Dapi.sendXhr(e, te.Dapi.Method.GET, te.Dapi.ApiUrl.FILES, t);
    }),
    (te.Dapi.blobToBase64 = function (e, t, o) {
        var a = new FileReader();
        (a.onload = function (n) {
            var e = a.result;
            if ((null == e && n && n.target && (e = n.target.result), null == e)) o("dataUrl was null in blobToBase64()");
            else
                try {
                    var r = e.split(",")[1];
                    t(r);
                } catch (e) {
                    o(e);
                }
        }),
            (a.onerror = function () {
                var e = a.error;
                o(e);
            }),
            a.readAsDataURL(e);
    }),
    (te.Dapi.updateFileContent = function (e, t, o, a) {
        te.Dapi.blobToBase64(t, bindFn(te.Dapi.doUpdateFileContent, this, e, o, a), bindFn(te.Dapi.blobToBase64ErrorFn, this, e));
    }),
    (te.Dapi.uploadFile = function (e, t, o, a) {
        te.Dapi.blobToBase64(t, bindFn(te.Dapi.doUploadFile, this, e, o, a), bindFn(te.Dapi.blobToBase64ErrorFn, this, e));
    }),
    (te.Dapi.blobToBase64ErrorFn = function (e, t) {
        te.Dapi.invokeCallback(e, te.Dapi.CbType.ERROR, "Error: blobToBase64() failed in uploadFile()", t);
    }),
    (te.Dapi.doUploadFile = function (e, t, o, a) {
        var n = { uploadType: "multipart", fields: te.Dapi.DEFAULT_FIELDS_CREATE, supportsAllDrives: "true" },
            r = { name: t };
        o && (r.parents = [o]), null == a && (a = "");
        var p =
            te.Dapi.MULTIPART_DELIMITER +
            "Content-Type: " +
            te.Dapi.MimeType.JSON +
            "; charset=UTF-8" +
            te.Dapi.CRLF +
            te.Dapi.CRLF +
            JSON.stringify(r) +
            te.Dapi.MULTIPART_DELIMITER +
            "Content-Transfer-Encoding: base64" +
            te.Dapi.CRLF +
            te.Dapi.CRLF +
            a +
            te.Dapi.MULTIPART_CLOSE_DELIMITER;
        te.Dapi.sendXhr(e, te.Dapi.Method.POST, te.Dapi.ApiUrl.UPLOAD, n, p, te.Dapi.MULTIPART_CONTENT_TYPE, te.Dapi.XhrResponseType.JSON);
    }),
    (te.Dapi.doUpdateFileContent = function (e, t, o, a) {
        var n = { uploadType: "multipart", fields: te.Dapi.DEFAULT_FIELDS_CREATE, supportsAllDrives: "true" };
        null == a && (a = "");
        var r = {};
        o && (r.name = o);
        var p =
            te.Dapi.MULTIPART_DELIMITER +
            "Content-Type: " +
            te.Dapi.MimeType.JSON +
            "; charset=UTF-8" +
            te.Dapi.CRLF +
            te.Dapi.CRLF +
            JSON.stringify(r) +
            te.Dapi.MULTIPART_DELIMITER +
            "Content-Transfer-Encoding: base64" +
            te.Dapi.CRLF +
            te.Dapi.CRLF +
            a +
            te.Dapi.MULTIPART_CLOSE_DELIMITER;
        te.Dapi.sendXhr(e, te.Dapi.Method.PATCH, te.Dapi.ApiUrl.UPLOAD + t, n, p, te.Dapi.MULTIPART_CONTENT_TYPE, te.Dapi.XhrResponseType.JSON);
    }),
    (te.Dapi.updateFileMetadata = function (e, t, o) {
        var a = { fields: te.Dapi.DEFAULT_FIELDS_CREATE, supportsAllDrives: "true" },
            n = {};
        o && (n.name = o), te.Dapi.sendXhr(e, te.Dapi.Method.PATCH, te.Dapi.ApiUrl.FILES + t, a, JSON.stringify(n), te.Dapi.MimeType.JSON, te.Dapi.XhrResponseType.JSON);
    }),
    (te.Dapi.createFolder = function (e, t, o) {
        var a = { name: t, mimeType: te.Dapi.MimeType.FOLDER };
        o && (a.parents = [o]);
        var n = { fields: te.Dapi.DEFAULT_FIELDS_CREATE, supportsAllDrives: "true" };
        te.Dapi.sendXhr(e, te.Dapi.Method.POST, te.Dapi.ApiUrl.FILES, n, JSON.stringify(a), te.Dapi.MimeType.JSON, te.Dapi.XhrResponseType.JSON);
    }),
    (te.Dapi.sendXhr = function (t, o, a, n, r, p, i, s) {
        var l = new XMLHttpRequest();
        te.Dapi.activeRequests.push(l);
        var d = p || te.Dapi.MimeType.JSON,
            E = i || te.Dapi.XhrResponseType.JSON;
        if (
            ((l.onreadystatechange = function () {
                if (4 == l.readyState)
                    if ((te.Dapi.removePendingXhr(l), (200 == l.status && null != l.response && null != l.response) || (204 == l.status && !l.response))) {
                        var e = l.response;
                        e && "" === l.responseType && "string" == typeof l.response && (e = JSON.parse(l.response)), te.Dapi.invokeCallback(t, te.Dapi.CbType.SUCCESS, e);
                    } else if (0 === l.status || (200 == l.status && (null == l.response || null == l.response))) {
                        logImpression("xhr_aborted", "xhr", null == "xhr_status=" + l.status + ", xhr_response == null? " + l.response);
                        var a = te.Dapi.getErrorMessage(te.Dapi.ErrType.REQUEST_ABORTED);
                        te.Dapi.invokeCallback(t, te.Dapi.CbType.ABORT, a);
                    } else {
                        var n = te.Dapi.XHR_ERROR_CODES[l.status],
                            r = l.statusText || "",
                            p = "",
                            i = l.response;
                        if (
                            (i && "" === l.responseType && "string" == typeof i && (i = JSON.parse(i)),
                            i && i.error && ((p = i.error.message || ""), p && (r ? (r += " - " + p) : (r = p))),
                            l.response && l.response instanceof Blob && "application/json" === l.response.type)
                        ) {
                            var s = new FileReader();
                            (s.onload = function (a) {
                                var e = "";
                                try {
                                    var p = JSON.parse(a.target.result);
                                    if (p && p.error) e = p.error.errors && 0 < p.error.errors.length ? p.error.errors[0].reason : p.error;
                                    else {
                                        e = (p || "") + " (" + a.target.result + ")";
                                    }
                                } catch (t) {
                                    e = "Error parsing response BLOB JSON (" + t + ")";
                                }
                                var i = n + " " + l.status + " [" + e + "]" + (r ? " (" + r + ")" : "");
                                logImpression("xhr_http_error", "xhr", "method=" + o + "; error: " + i), te.Dapi.invokeCallback(t, te.Dapi.CbType.ERROR, n, te.Dapi.getErrorMessage(n, e));
                            }),
                                s.readAsText(l.response);
                        } else {
                            var d = n + " " + l.status + (r ? " (" + r + ")" : "");
                            logImpression("xhr_http_error2", "xhr", "method=" + o + "; error: " + d), te.Dapi.invokeCallback(t, te.Dapi.CbType.ERROR, n, te.Dapi.getErrorMessage(n, p));
                        }
                    }
            }),
            t[te.Dapi.CbType.PROGRESS])
        ) {
            var A = function (o) {
                if (o && o.lengthComputable) {
                    var e = o.loaded,
                        a = o.total;
                    400 == l.status || 401 == l.status || 403 == l.status || 404 == l.status || 500 == l.status || 503 == l.status || te.Dapi.invokeCallback(t, te.Dapi.CbType.PROGRESS, e, a);
                }
            };
            o == te.Dapi.Method.GET ? (l.onprogress = A) : (l.upload.onprogress = A);
        }
        t[te.Dapi.CbType.ERROR] &&
            (l.onerror = function (o) {
                var e = te.Dapi.ErrMsg.XHR_NETWORK,
                    a = "";
                l.statusText && (a += l.statusText + " - "), o && (o.target && o.target.status && (a += " - " + o.target.status), o.error && (a += " - " + o.error));
                var n = e + (a ? " (" + a + ")" : "");
                logImpression("xhr_network_error", "xhr", "error: " + n), te.Dapi.removePendingXhr(l), te.Dapi.invokeCallback(t, te.Dapi.CbType.ERROR, e, a);
            });
        var u = te.Dapi.buildCorsUrl(a, n || {});
        l.open(o, u, !0), (l.responseType = E), l.setRequestHeader("Authorization", "Bearer " + getAccessToken()), d && l.setRequestHeader("Content-Type", d), s && l.setRequestHeader("Range", "bytes=" + s), l.send(r || void 0);
    }),
    (te.Dapi.buildCorsUrl = function (e, t) {
        var o = e,
            a = te.Dapi.buildQuery(t),
            n = !1;
        return a && ((o += "?" + a), (n = !0)), o;
    }),
    (te.Dapi.buildQuery = function (e) {
        return (
            (e = e || {}),
            Object.keys(e)
                .map(function (t) {
                    return encodeURIComponent(t) + "=" + encodeURIComponent(e[t]);
                })
                .join("&")
        );
    }),
    (te.Dapi.removePendingXhr = function (e) {
        var t = te.Dapi.activeRequests.indexOf(e);
        -1 != t && te.Dapi.activeRequests.splice(t, 1);
    }),
    (te.Dapi.abortAllRequests = function () {
        for (var e, t = te.Dapi.activeRequests.slice(0), o = 0; o < t.length; o++) (e = t[o]), e && e.abort && e.abort();
    }),
    (te.Dapi.invokeCallback = function (e, t, o, a) {
        var n = e[t];
        n && n(o, a);
    }),
    (te.Dapi.downloadFileBytes = function (e, t, o, a) {
        var n = { alt: "media", supportsAllDrives: "true" };
        a && (n.acknowledgeAbuse = !0), te.Dapi.sendXhr(t, te.Dapi.Method.GET, te.Dapi.ApiUrl.FILES + e, n, void 0, void 0, te.Dapi.XhrResponseType.BLOB, o);
    });
var winOpen = window.open;
window.open = function () {
    try {
        if (arguments && 2 < arguments.length) {
            var e = arguments[2];
            if (null != e) {
                var t = window.screen.width,
                    o = window.screen.height,
                    a = "height=",
                    n = e.indexOf(a),
                    r = e.indexOf(",", n);
                if (-1 != n && -1 != r) {
                    var p = parseInt(e.substring(n + a.length, r)),
                        i = Math.round(Math.min(660, o));
                    e = e.substring(0, n + a.length) + i + e.substring(r);
                    var s = e.indexOf("top="),
                        l = e.indexOf(",", s);
                    if (-1 != s && -1 != l) {
                        var d = parseInt(e.substring(s + "top=".length, l));
                        e = e.substring(0, s + "top=".length) + (d - (i - p) / 2) + e.substring(l);
                    }
                    arguments[2] = e;
                }
            }
        }
    } catch (e) {
        logImpression("window_open_height_update_err", "app_load", e);
    }
    var E = winOpen.apply(this, arguments);
    return E;
};
var modes = [];
function getModeForPath(e) {
    for (var t = modesByName.text, o = e.split(/[\/\\]/).pop(), a = 0; a < modes.length; a++)
        if (modes[a].supportsFile(o)) {
            t = modes[a];
            break;
        }
    return t;
}
var Mode = function (e, t, o) {
    (this.name = e), (this.caption = t), (this.mode = "ace/mode/" + e), (this.extensions = o);
    var a;
    (a = /\^/.test(o)
        ? o.replace(/\|(\^)?/g, function (e, t) {
              return "$|" + (t ? "^" : "^.*\\.");
          }) + "$"
        : "^.*\\.(" + o + ")$"),
        (this.extRe = new RegExp(a, "gi"));
};
Mode.prototype.supportsFile = function (e) {
    return e.match(this.extRe);
};
var supportedModes = {
        ABAP: ["abap"],
        ABC: ["abc"],
        ActionScript: ["as"],
        ADA: ["ada|adb"],
        Apache_Conf: ["^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd"],
        AsciiDoc: ["asciidoc|adoc"],
        ASL: ["dsl|asl"],
        Assembly_x86: ["asm|a"],
        AutoHotKey: ["ahk"],
        Apex: ["apex|cls|trigger|tgr"],
        AQL: ["aql"],
        BatchFile: ["bat|cmd"],
        C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
        C9Search: ["c9search_results"],
        Crystal: ["cr"],
        Cirru: ["cirru|cr"],
        Clojure: ["clj|cljs"],
        Cobol: ["CBL|COB"],
        coffee: ["coffee|cf|cson|^Cakefile"],
        ColdFusion: ["cfm"],
        CSharp: ["cs"],
        Csound_Document: ["csd"],
        Csound_Orchestra: ["orc"],
        Csound_Score: ["sco"],
        CSS: ["css"],
        Curly: ["curly"],
        D: ["d|di"],
        Dart: ["dart"],
        Diff: ["diff|patch"],
        Dockerfile: ["^Dockerfile"],
        Dot: ["dot"],
        Drools: ["drl"],
        Edifact: ["edi"],
        Eiffel: ["e|ge"],
        EJS: ["ejs"],
        Elixir: ["ex|exs"],
        Elm: ["elm"],
        Erlang: ["erl|hrl"],
        Forth: ["frt|fs|ldr|fth|4th"],
        Fortran: ["f|f90"],
        FSharp: ["fsi|fs|ml|mli|fsx|fsscript"],
        FSL: ["fsl"],
        FTL: ["ftl"],
        Gcode: ["gcode"],
        Gherkin: ["feature"],
        Gitignore: ["^.gitignore"],
        Glsl: ["glsl|frag|vert"],
        Gobstones: ["gbs"],
        golang: ["go"],
        GraphQLSchema: ["gql"],
        Groovy: ["groovy"],
        HAML: ["haml"],
        Handlebars: ["hbs|handlebars|tpl|mustache"],
        Haskell: ["hs"],
        Haskell_Cabal: ["cabal"],
        haXe: ["hx"],
        Hjson: ["hjson"],
        HTML: ["html|htm|xhtml|vue|we|wpy"],
        HTML_Elixir: ["eex|html.eex"],
        HTML_Ruby: ["erb|rhtml|html.erb"],
        INI: ["ini|conf|cfg|prefs"],
        Io: ["io"],
        Jack: ["jack"],
        Jade: ["jade|pug"],
        Java: ["java"],
        JavaScript: ["js|jsm|jsx"],
        JSON5: ["json5"],
        JSON: ["json"],
        JSONiq: ["jq"],
        JSP: ["jsp"],
        JSSM: ["jssm|jssm_state"],
        JSX: ["jsx"],
        Julia: ["jl"],
        Kotlin: ["kt|kts"],
        LaTeX: ["tex|latex|ltx|bib"],
        LESS: ["less"],
        Liquid: ["liquid"],
        Lisp: ["lisp"],
        LiveScript: ["ls"],
        LogiQL: ["logic|lql"],
        LSL: ["lsl"],
        Lua: ["lua"],
        LuaPage: ["lp"],
        Lucene: ["lucene"],
        Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
        Markdown: ["md|markdown"],
        Mask: ["mask"],
        MATLAB: ["matlab"],
        Maze: ["mz"],
        MEL: ["mel"],
        MIXAL: ["mixal"],
        MUSHCode: ["mc|mush"],
        MySQL: ["mysql"],
        Nginx: ["nginx|conf"],
        Nix: ["nix"],
        Nim: ["nim"],
        NSIS: ["nsi|nsh"],
        Nunjucks: ["nunjucks|nunjs|nj|njk"],
        ObjectiveC: ["m|mm"],
        OCaml: ["ml|mli"],
        Pascal: ["pas|p"],
        Perl: ["pl|pm"],
        Perl6: ["p6|pl6|pm6"],
        pgSQL: ["pgsql"],
        PHP_Laravel_blade: ["blade.php"],
        PHP: ["php|inc|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
        Puppet: ["epp|pp"],
        Pig: ["pig"],
        Powershell: ["ps1"],
        Praat: ["praat|praatscript|psc|proc"],
        Prolog: ["plg|prolog"],
        Properties: ["properties"],
        Protobuf: ["proto"],
        Python: ["py"],
        R: ["r"],
        Razor: ["cshtml|asp"],
        RDoc: ["Rd"],
        Red: ["red|reds"],
        RHTML: ["Rhtml"],
        RST: ["rst"],
        Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
        Rust: ["rs"],
        SASS: ["sass"],
        SCAD: ["scad"],
        Scala: ["scala|sbt"],
        Scheme: ["scm|sm|rkt|oak|scheme"],
        SCSS: ["scss"],
        SH: ["sh|bash|^.bashrc"],
        SJS: ["sjs"],
        Slim: ["slim|skim"],
        Smarty: ["smarty|tpl"],
        snippets: ["snippets"],
        Soy_Template: ["soy"],
        Space: ["space"],
        SQL: ["sql"],
        SQLServer: ["sqlserver"],
        Stylus: ["styl|stylus"],
        SVG: ["svg"],
        Swift: ["swift"],
        Tcl: ["tcl"],
        Terraform: ["tf", "tfvars", "terragrunt"],
        Tex: ["tex"],
        Text: ["txt"],
        Textile: ["textile"],
        Toml: ["toml"],
        TSX: ["tsx"],
        Twig: ["latte|twig|swig"],
        Typescript: ["ts|typescript|str"],
        Vala: ["vala"],
        VBScript: ["vbs|vb"],
        Velocity: ["vm"],
        Verilog: ["v|vh|sv|svh"],
        VHDL: ["vhd|vhdl"],
        Visualforce: ["vfp|component|page"],
        Wollok: ["wlk|wpgm|wtest"],
        XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
        XQuery: ["xq"],
        YAML: ["yaml|yml"],
        Zeek: ["zeek|bro"],
        Django: ["html"],
    },
    nameOverrides = {
        ObjectiveC: "Objective-C",
        CSharp: "C#",
        golang: "Go",
        C_Cpp: "C and C++",
        Csound_Document: "Csound Document",
        Csound_Orchestra: "Csound",
        Csound_Score: "Csound Score",
        coffee: "CoffeeScript",
        HTML_Ruby: "HTML (Ruby)",
        HTML_Elixir: "HTML (Elixir)",
        FTL: "FreeMarker",
        PHP_Laravel_blade: "PHP (Blade Template)",
        Perl6: "Perl 6",
        AutoHotKey: "AutoHotkey / AutoIt",
    },
    modesByName = {};
for (var name in supportedModes) {
    var data = supportedModes[name],
        displayName = (nameOverrides[name] || name).replace(/_/g, " "),
        filename = name.toLowerCase(),
        mode = new Mode(filename, displayName, data[0]);
    (modesByName[filename] = mode), modes.push(mode);
}
