function checkBoxLimit() {
  let limit = 4
  let form = document.getElementById('interest_form')
  if (form !== null) {
    let checkBoxGroup = form.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkBoxGroup.length; i++) {
      checkBoxGroup[i].onclick = function () {
        let checkedcount = 0
        for (let i = 0; i < checkBoxGroup.length; i++) {
          checkedcount += checkBoxGroup[i].checked ? 1 : 0
        }
        if (checkedcount > limit) {
          this.checked = false
        }
      }
    }
  }
}

checkBoxLimit()
