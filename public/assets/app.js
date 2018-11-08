loadComments = (id) => {
    console.log("none");
}

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
        newComment.html( `<button class="delete" data-id="${id}" data-commentId="${id}">Delete</button>` + $("#comment").val());
    
        $("#comments").append(newComment);
    })
})


    $(document).on('click', '.delete', function() {
    event.preventDefault();
    const commentID = $(this).attr("data-commentId");
    console.log("in here?");
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