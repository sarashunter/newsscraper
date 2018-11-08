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
        loadComments($("#submit").attr("data-id"));
    })
})

$(".delete").click(function () {
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