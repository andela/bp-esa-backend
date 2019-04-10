export const totalFreckleAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId"
        from "freckleAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where a."createdAt" BETWEEN ? and ?
;
`;

export const successFreckleAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId",

        SUM(
            (
                CASE 
                    WHEN status='success' THEN 0
                    ELSE 1
                END
            )
        ) as status

        from "freckleAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    WHERE 1=1
    and f.status = 0
    and a."createdAt" BETWEEN ? and ?
;
`;
