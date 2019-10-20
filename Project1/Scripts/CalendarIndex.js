class DOMManipulator {

    static setDisplay(id, typeOfDisplay)
    {
        document.getElementById(id).style.display = typeOfDisplay;
    }

    static setInnerHtml(id, value)
    {
        document.getElementById(id).innerHTML = value;
    }

    static extendInnerHtml(id, value)
    {
        $("#" + id).append(value);
    }

    static setOnClick(id, func)
    {
        document.getElementById(id).addEventListener("click", func);
    }

    static getChildNodes(id)
    {
        return document.getElementById(id).childNodes;
    }
}


class HTMLElement {
    constructor(id = "")
    {
        this.id = id;
    }

    Show()
    {
        DOMManipulator.setDisplay(this.id, "block");
    }

    ShowAndSetHTML(HTML)
    {
        this.Show();
        DOMManipulator.setInnerHtml(this.id, HTML);
    }

    ShowAndExtendHTML(HTML)
    {
        this.Show();
        DOMManipulator.extendInnerHtml(this.id, HTML);
    }

    Hide()
    {
        DOMManipulator.setDisplay(this.id, "none");
    }

    HideAndEmpty()
    {
        this.Hide();
        DOMManipulator.setInnerHtml(this.id, "");
    }

    Empty()
    {
        DOMManipulator.setInnerHtml(this.id, "");
    }

    setNavigationButtonsListeners(idsFuncsObj)
    {
        for (let [key, value] of Object.entries(idsFuncsObj))
        {
            DOMManipulator.setOnClick(key, value);
        }
    }

    ApiCallPost(url, data, callback = null)
    {
        $.ajax({
            url: url,
            data: data,
            type: "POST"
        }).done(() => { if (callback) callback(); })
    }

    ApiCallDelete(url, callback = null)
    {
        $.ajax({
            url: url,
            type: "DELETE",
            crossDomain: true
        }).done(() => { if (callback) callback(); })
    }

    ApiCallPut(url, data, callback = null)
    {
        $.ajax({
            url: url,
            type: "PUT",
            crossDomain: true,
            data: data
        }).done(() => { if (callback) callback(); })
        
    }

    ClearForm()
    {
        let childNodes = DOMManipulator.getChildNodes(this.id);
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeName === "INPUT" && childNodes[i].type !== "hidden") {
                childNodes[i].value = "";
            }
        }
    }

    GetFormData()
    {
        let childNodes = DOMManipulator.getChildNodes(this.id);
        let obj = {};
        for (var i = 0; i < childNodes.length; i++) {
            
            if (childNodes[i].nodeName === "INPUT")
            {
                if (childNodes[i].value === "true")
                    obj[childNodes[i].name] = true;
                else
                    obj[childNodes[i].name] = childNodes[i].value;
            }
        }
        return obj;
    }

    GetAndClearFormDataAndCallApiPost(url, callback = null)
    {
        this.ApiCallPost(url, this.GetFormData(), callback);
        this.ClearForm();
    }

    GetAndClearFormDataAndCallApiPut(url, callback = null) {
        this.ApiCallPut(url, this.GetFormData(), callback);
        this.ClearForm();
    }
}


class CalendarWidget extends HTMLElement
{

    constructor()
    {
        super("CalendarWidget");
        this.calendarData = ApiCall("http://localhost:51992/api/calendar", false);
        this.currentMonthIndex = this.calendarData["IndexOfCurrentMonth"];
        this.parentDivId = "CalendarWidget";
        this.calendarDivId = "Calendar";
        this.HTML = "<div id=\"Calendar\">" +
            "</div >" +
            "<button class=\"navigBtn\" id=\"CalendarLeftBtn\">W lewo</button>" +
            "<button class=\"navigBtn\" id=\"CalendarRightBtn\">W prawo</button>" +
            "<button class=\"navigBtn\" id=\"CalendarCurrentBtn\">Obecny miesiąc</button>";

        super.ShowAndSetHTML(this.HTML);

        this.insertCalendar();

        super.setNavigationButtonsListeners({
            "CalendarLeftBtn":    () => this.calendarSwipe("left"),
            "CalendarRightBtn":   () => this.calendarSwipe("right"),
            "CalendarCurrentBtn": () => {
                this.calendarData["IndexOfCurrentMonth"] = this.currentMonthIndex;
                this.insertCalendar();
            }
        });
    }

    bindOnClickForEachDateCell()
    {
        let dateCells = document.getElementsByClassName("dateCell");

        for (var i = 0; i < dateCells.length; i++)
        {
            dateCells[i].addEventListener("click", event => this.dateCellClick(event));
        }
    }

    insertCalendar()
    {
        DOMManipulator.setInnerHtml(this.calendarDivId,
            this.calendarData["YearlyCalendar"][this.calendarData["IndexOfCurrentMonth"]]);

        this.bindOnClickForEachDateCell();
    }

    calendarSwipe(direction)
    {
        if (direction === "left" && this.calendarData["IndexOfCurrentMonth"] > 0)
        {
            this.calendarData["IndexOfCurrentMonth"]--;
        }
        else if (direction === "right" &&
            this.calendarData["IndexOfCurrentMonth"] < this.calendarData["YearlyCalendar"].length - 1)
        {
            this.calendarData["IndexOfCurrentMonth"]++;
        }
        this.insertCalendar();
    }

    dateCellClick(event)
    {
        super.Hide();

        new CalendarEventsView(event.srcElement.id);
    }
}


class CalendarEventsView extends HTMLElement
{

    constructor(dateName)
    {
        super("CalendarEventsView");

        this.HTML = "<div>" +
            "<h6>" +
            dateName +
            "</h6>" +
            "<div id=\"CalendarEventsAddForm\"></div>" +
            "<button id=\"CalendarEventsAddEventBtn\">+</button>" +
            "<button id=\"CalendarEventsExitBtn\" onClick=\"\">X</button>" +
            "<div id=\"CalendarEvents\"></div>" +
            "</div>";

        this.dateName = dateName;
        this.parentDivId = "CalendarEventsView";

        super.ShowAndSetHTML(this.HTML);

        this.ShowEvents(this.dateName, this.ShowEventsCallback);

        super.setNavigationButtonsListeners({
            "CalendarEventsExitBtn": () => this.Exit(),
            "CalendarEventsAddEventBtn": () => this.ShowAddEventPanel()
        });
    }


    ShowEvents(dateName, callback)
    {
        DOMManipulator.setInnerHtml("CalendarEvents", "");
        let routeParam = dateName.replace(/\./g, "-");
        let events = ApiCall("http://localhost:51992/api/Calendar/Events/" + routeParam, true, callback);
    }

    ShowEventsCallback(json)
    {
        json.forEach((object, index) =>
        {
            console.log(object);
            for (let [key, value] of Object.entries(object))
                if (value === null)
                    object[key] = "";

            new CalendarEvent(object.Name, object.Description, object.Hour, object.Id, object.Checked, object);
        })
    }

    ShowAddEventPanel()
    {
        new CalendarEventsViewAdd(this.dateName, this.ShowEvents, this.ShowEventsCallback);
    }

    Exit()
    {
        super.HideAndEmpty();
        DOMManipulator.setDisplay("CalendarWidget", "block");
    }
}


class CalendarEventsViewAdd extends HTMLElement
{
    constructor(dateName, updateEventsFn, updateEventsCallback, editMode = false, object = {}, parentObj = {})
    {
        super("CalendarEventsAddForm");
        this.object = object;
        this.parentObj = parentObj;
        this.editMode = editMode;
        this.parentDivId = "CalendarEventsAddForm";
        this.dateName = dateName;
        this.HTML = "Godzina: <input type=\"time\" " + (object.Hour ? "value=" + object.Hour : "") + " name=\"Hour\"/>" +
            "Nazwa: <input type=\"text\"" + (object.Name ? "value=\"" + object.Name  + "\"": "") + " name=\"Name\"/>" +
            "Opis: <input type=\"text\" " + (object.Description ? "value=\"" + object.Description + "\"" : "") + " name=\"Description\"/>" +
            "<input type=\"hidden\" name=\"Date\" value=\"" + this.dateName + "\"/>" +
            "<input type=\"hidden\" name=\"Checked\" value=" + (object.Checked == "true" || object.Checked == true ? true : false) + ">" +
            "<p id=\"EventAddErrorMessage\"></p>" +
            "<button id=\"EventAddSaveBtn\" type=\"submit\">Zapisz</button>" +
            "<button id=\"EventAddAbortBtn\" type=\"submit\">Odrzuć</button>";

        document.getElementById("CalendarEventsAddEventBtn").disabled = true;

        this.updateEventsFn = updateEventsFn;
        this.updateEventCallback = updateEventsCallback;

        super.ShowAndSetHTML(this.HTML);

        super.setNavigationButtonsListeners({
            "EventAddAbortBtn": () => this.AbortAdding(),
            "EventAddSaveBtn": () => this.addEventToDb()
    });
    }

    AbortAdding()
    {
        super.HideAndEmpty();
        document.getElementById("CalendarEventsAddEventBtn").disabled = false;
        if (this.editMode)
        {
            DOMManipulator.setDisplay("CalendarEvents", "block");
        }
    }

    checkValidityOfFields()
    {
        let data = super.GetFormData();
        return (data["Name"]  || data["Hour"]);
    }

    updateView(cb)
    {
        cb(this.dateName, this.updateEventCallback);
    }

    addEventToDb()
    {
        let msg = "";
        if (this.checkValidityOfFields())
        {
            if (this.editMode)
            {
                msg = "Pomyślnie edytowano wydarzenie";
                let data = super.GetFormData();
                super.GetAndClearFormDataAndCallApiPut("http://localhost:51992/api/Calendar/Events/" + this.object.Id);
                super.HideAndEmpty();
                this.parentObj.Reload(data.Hour, data.Name, data.Description, data.Checked);
            }
            else
            {
                msg = "Pomyślnie dodano wydarzenie";
                super.GetAndClearFormDataAndCallApiPost("http://localhost:51992/api/Calendar/Events", () => this.updateView(this.updateEventsFn));
            }
            
        }
        else
        {
            msg = "Wydarzenie musi zawierać przynajmniej godzinę lub nazwę";
        }
        if (!this.editMode)
            DOMManipulator.setInnerHtml("EventAddErrorMessage", msg);
    }
}


class CalendarEvent extends  HTMLElement
{
    constructor(name , description , hour, eventId, checked, object)
    {
        super("CalendarEvents");

        this.self = object;
        this.name = name;
        this.description = description;
        this.hour = hour;
        this.checked = checked;
        this.eventId = eventId;
        this.eventDeleteId = "EventDelete" + eventId;
        this.eventEditId = "EventEdit" + eventId;
        this.eventCheckId = "EventCheck" + eventId;
        this.eventElementId = "Event" + eventId;
        this.eventLineThroughId = "EventLineThrough" + eventId;

        this.HTML = "<p id =\"" + this.eventElementId + "\"><span style='text-decoration:" + (this.checked ? "line-through" : "none") + "' id=\"" +
            this.eventLineThroughId + "\">" + "<span class=\"eventHour eventProp\">" + hour + "</span>" + "\t" + "<span class=\"eventName eventProp\">" + name + "</span>" + "\n" + "<span class=\"eventDescription eventProp\">" + description + "</span>" + "</span>" +
            "<button id=\"" + this.eventCheckId + "\">" + (this.checked ? "Odkreśl" : "Przekreśl") + "</button>" +
            "<button id=\"" + this.eventEditId + "\">Edytuj</button>" +
            "<button id=\"" + this.eventDeleteId + "\">Usuń</button>" +
            "</p>";

        super.ShowAndExtendHTML(this.HTML);

        this.LoadButtons();
    }

    LoadButtons()
    {
        let navigationButtonsConfigObj = {}
        navigationButtonsConfigObj[this.eventDeleteId] = () => this.DeleteEvent();
        navigationButtonsConfigObj[this.eventCheckId] = () => this.CheckEvent();
        navigationButtonsConfigObj[this.eventEditId] = () => this.EditEvent(this);

        super.setNavigationButtonsListeners(navigationButtonsConfigObj);
    }

    Reload(hour, name, description, checked)
    {
        this.name = name;
        this.description = description;
        this.hour = hour;
        this.checked = checked;

        this.self.Name = name;
        this.self.Description = description;
        this.self.Hour = hour;
        this.self.Checked = checked;

        this.HTML = "<span style='text-decoration:" +
            (checked == "true" || checked == true ? "line-through" : "none") +
            "' id=\"" +
            this.eventLineThroughId +
            "\">" +
            "<span class=\"eventHour eventProp\">" +
            hour +
            "</span>" +
            "\t" +
            "<span class=\"eventName eventProp\">" +
            name +
            "</span>" +
            "\n" +
            "<span class=\"eventDescription eventProp\">" +
            description +
            "</span>" +
            "</span>" +
            "<button id=\"" +
            this.eventCheckId +
            "\">" +
            (checked == "true" || checked == true ? "Odkreśl" : "Przekreśl") +
            "</button>" +
            "<button id=\"" +
            this.eventEditId +
            "\">Edytuj</button>" +
            "<button id=\"" +
            this.eventDeleteId +
            "\">Usuń</button>";


        DOMManipulator.setInnerHtml(this.eventElementId, this.HTML);
        this.LoadButtons();
        super.Show();
    }

    EditEvent(thisEvent)
    {
        super.Hide();
        let edit = new CalendarEventsViewAdd(this.self.Date, null, null, true, this.self, thisEvent);
    }

    DeleteEvent()
    {
        DOMManipulator.setDisplay(this.eventElementId, "none");
        super.ApiCallDelete("http://localhost:51992/api/Calendar/Events/" + this.eventId)
    }

    CheckEvent()
    {
        let crossOutText = document.getElementById(this.eventLineThroughId);
        let checkBtn = document.getElementById(this.eventCheckId);

        if (checkBtn.textContent === "Przekreśl")
        {
            crossOutText.style.textDecoration = "line-through";
            checkBtn.innerText = "Odkreśl";
            this.self["Checked"] = true;
        }
        else
        {
            crossOutText.style.textDecoration = "none";
            checkBtn.innerText = "Przekreśl";
            this.self["Checked"] = false;
        }
        super.ApiCallPut("http://localhost:51992/api/Calendar/Events/" + this.eventId, this.self);
    }

}


function ApiCall(url, isAsync, doneFunc = null)
{
    let data = null;

    $.ajax(
        {
            type: "GET",
            url: url,
            async: isAsync

        }).done(json => {
        if (doneFunc === null) {
            data = json;
        } else {
            doneFunc(json);
        }

    });

    return data;
}

function Start()
{
    let calendar = new CalendarWidget();
}

$(document).ready(Start);


