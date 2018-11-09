$("#submit").on("click", () => {
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "/submit",
        dataType: "json",
        data: {
            commentText: $("#comment").val(),
            id: $("#submit").attr("data-id")
        }
    }).then((data) => {
        console.log("data" + JSON.stringify(data));
        const id = data.comments.slice(-1);
        var newComment = $("<div>");
        newComment.attr("id", id);
        newComment.html(`<button  type="button" class="btn btn-light delete btn-sm" data-id="${id}" data-commentId="${id}"><img src="/assets/open-iconic-master/svg/trash.svg" alt="icon name"></button> ` + $("#comment").val());
        $("#comment").val("");
        $("#comments").append(newComment);
    })
})

//When delete is clicked, the comment is removed from the page and then a POST request updates it in mongoDB.
$(document).on('click', '.delete', function () {
    event.preventDefault();
    const commentID = $(this).attr("data-commentId");

    $("#" + commentID).remove();

    $.ajax({
        type: "POST",
        url: "/delete",
        dataType: "json",
        data: {
            id: $(this).attr("data-id"),
            commentId: $(this).attr("data-commentId")
        }
    });
})
// })